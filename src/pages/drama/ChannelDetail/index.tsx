import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Toast } from 'antd-mobile';
import useUrlState from '@ahooksjs/use-url-state';
import useAxios from 'axios-hooks';
import VideoSwiper from '@/components/video-swiper';
import { parseModel } from '@/utils';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import IconComment from '@/assets/svgr/iconComment.svg?react';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import type { IVideoDataWithModel, IVideoModel } from '@/@types';
import styles from './index.module.less';
import 'swiper/less';
import '@byteplus/veplayer/index.min.css';
import { API_PATH } from '@/service/path';
import Loading from '@/components/loading';
import LikeComp from '@/components/like';
import { renderCount } from '@/utils/util';
import CommentComp from '@/components/comment';

type ResultType = {
  video_model: string;
} & Omit<IVideoDataWithModel, 'videoModel'>;

function ChannelDetail() {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const startTime = urlState.startTime || 0;
  const [commentVisible, setCommentVisible] = useState(false);

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
  const list: IVideoDataWithModel[] = useMemo(
    () =>
      ((data?.response || []) as ResultType[]).map(item => ({
        ...item,
        videoModel: parseModel(item.video_model) as IVideoModel & { video_model?: string },
      })),
    [data?.response],
  );
  const current: IVideoDataWithModel | undefined = useMemo(() => list?.[activeIndex], [activeIndex, list]);
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
      <NavBar backIcon={<IconBack />} className={styles.head} left={current.drama_title} onBack={back} />
      <VideoSwiper
        startTime={startTime}
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
      <CommentComp
        commentVisible={commentVisible}
        setCommentVisible={setCommentVisible}
        list={commentsData?.response ?? []}
        loading={commentLoading}
      />
    </div>
  );
}

export default ChannelDetail;
