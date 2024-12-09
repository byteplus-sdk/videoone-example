import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Popup, Toast } from 'antd-mobile';
import useUrlState from '@ahooksjs/use-url-state';
import useAxios from 'axios-hooks';
import VideoSwiper from '@/components/video-swiper';
import { parseModel } from '@/utils';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import IconComment from '@/assets/svgr/iconComment.svg?react';
import IconUp from '@/assets/svgr/iconUp.svg?react';
import IconMenu from '@/assets/svgr/iconMenu.svg?react';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import type { IDramaDetailListItem, IVideoModel } from '@/@types';
import styles from './index.module.less';
import 'swiper/less';
import '@byteplus/veplayer/index.min.css';
import { API_PATH } from '@/service/path';
import Loading from '@/components/loading';
import LikeComp from '@/components/like';
import { renderCount } from '@/utils/util';
import CommentComp from '@/components/comment';
import classNames from 'classnames';

const playbackRateList = [
  {
    title: '2.0x',
    value: 2,
  },
  {
    title: '1.5x',
    value: 1.5,
  },
  {
    title: '1.25x',
    value: 1.25,
  },
  {
    title: '1x',
    value: 1,
  },
  {
    title: '0.75x',
    value: 0.75,
  },
];
function ChannelDetail() {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const startTime = urlState.startTime || 0;
  const [commentVisible, setCommentVisible] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [popupVisible, setPopupVisible] = useState(false);

  const [{ data, loading }] = useAxios(
    {
      url: API_PATH.GetDramaList,
      method: 'POST',
      data: {
        drama_id: urlState.id,
        play_info_type: 1,
        user_id: '1',
      },
    },
    { useCache: true },
  );

  const [{ data: commentsData, loading: commentLoading }, executeGetComments] = useAxios(
    {
      url: API_PATH.GetDramaVideoComments,
      method: 'GET',
    },
    { manual: true },
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setPlaybackRate(1);
  }, [activeIndex]);

  const list = useMemo(
    () =>
      ((data?.response || []) as IDramaDetailListItem['video_meta'][]).map(item => ({
        ...item,
        videoModel: parseModel(item.video_model) as IVideoModel,
      })),
    [data?.response],
  );
  const current = useMemo(() => list?.[activeIndex] ?? {}, [activeIndex, list]);
  useEffect(() => {
    if (current) {
      toastRef?.current?.close();
    } else {
      toastRef.current = Toast.show({
        icon: 'loading',
        content: '加载中…',
        duration: 0,
      });
    }
  }, [current]);

  useEffect(() => {
    const scrollFn = () => {
      window.scrollTo({ left: 0, top: 0 });
    };
    window.addEventListener('scrollend', scrollFn);
    return () => {
      window.removeEventListener('scrollend', scrollFn);
    };
  }, []);

  const back = () => navigate('/dramaGround');
  return loading ? (
    <div className={styles.loadingWrapper}>
      <Loading />
    </div>
  ) : (
    <div className={styles.wrap}>
      <NavBar backIcon={<IconBack />} className={styles.head} left={current.caption} onBack={back} />
      <div className={styles.body}>
        <VideoSwiper
          startTime={startTime}
          playbackRate={playbackRate}
          videoDataList={list}
          onChange={setActiveIndex}
          otherComponent={
            <div>
              <div className={styles.rightLane}>
                <div className={styles.btns}>
                  <div className={styles.like}>
                    <LikeComp like={current.like} />
                  </div>
                  <div
                    className={styles.comment}
                    onClick={e => {
                      e.stopPropagation();
                      setCommentVisible(true);
                      executeGetComments({
                        params: {
                          vid: current.vid,
                        },
                      });
                    }}
                  >
                    <IconComment />
                    <span>{renderCount(current.comment)}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.button}>
          <div className={styles.info}>
            <IconMenu />
            <span className={styles.title}>
              {current.caption} · {list.length} videos
            </span>
          </div>
          <IconUp />
        </div>
        <div
          className={styles.playbackRateBtn}
          onClick={() => {
            setPopupVisible(true);
          }}
        >
          {playbackRateList.find(item => item.value === playbackRate)?.title}
        </div>
      </div>
      <CommentComp
        commentVisible={commentVisible}
        setCommentVisible={setCommentVisible}
        list={commentsData?.response ?? []}
        loading={commentLoading}
      />
      <Popup
        visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false);
        }}
        bodyClassName={styles.popupBodyClass}
        maskClassName={styles.popupMaskClass}
      >
        <div className={styles.head}>Playback speed</div>
        <div className={styles.body}>
          {playbackRateList.map(item => (
            <div
              key={item.title}
              className={classNames(styles.item, { [styles.selected]: playbackRate === item.value })}
              onClick={() => {
                setPlaybackRate(item.value);
                setPopupVisible(false);
              }}
            >
              {item.title}
            </div>
          ))}
        </div>
      </Popup>
    </div>
  );
}

export default ChannelDetail;
