import React, { useState, useRef, useEffect } from 'react';
import { Popup } from 'antd-mobile';
import type { ToastHandler } from 'antd-mobile/es/components/toast/methods';
import useUrlState from '@ahooksjs/use-url-state';
import { CHANNEL_MODE, type IDramaDetailListItem } from '@/@types';
import VideoSwiper from '@/components/video-swiper';
import IconEnter from '@/assets/svgr/iconEnter.svg?react';
import IconDrama from '@/assets/svgr/iconDrama.svg?react';
import IconRcm from '@/assets/svgr/iconRcm.svg?react';
import IconComment from '@/assets/svgr/iconComment.svg?react';
import IconFire from '@/assets/svgr/iconFire.svg?react';
import styles from './index.module.less';
import 'swiper/less';
import '@byteplus/veplayer/index.min.css';
import Loading from '@/components/loading';
import Avatar from '@/assets/images/avatar.png';
import LikeComp from '@/components/like';
import { formatSecondsToTime, renderCount } from '@/utils/util';
import IconClose from '@/assets/svgr/iconClose.svg?react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import classNames from 'classnames';
import CommentComp from '@/components/comment';
import { useNavigate } from 'react-router-dom';
import t from '@/utils/translation';
import { setDetail } from '@/redux/actions/dramaDetail';
import { useDispatch } from 'react-redux';

interface IRecommend {
  isSliderMoving: boolean;
  onProgressDrag: () => void;
  onProgressDragend: () => void;
  videoDataList: IDramaDetailListItem[];
  loading: boolean;
  isChannel: boolean;
  isChannelActive: boolean;
}

const Channel: React.FC<IRecommend> = ({
  isSliderMoving,
  isChannel,
  onProgressDrag,
  onProgressDragend,
  videoDataList = [],
  loading,
  isChannelActive,
}) => {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const startTime = urlState.startTime || 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { drama_meta, video_meta }: IDramaDetailListItem = videoDataList[activeIndex] ?? {};
  const { drama_length, drama_title, drama_cover_url, drama_id } = drama_meta ?? {};
  const { name, comment, like, caption, vid, order, play_times, display_type } = video_meta ?? {};

  // const [{ data: dramaDetailListData, loading: dramaDetailListLoading }, executeGetGetDramaList] = useAxios(
  //   {
  //     url: API_PATH.GetDramaList,
  //     method: 'POST',
  //   },
  //   { manual: true },
  // );

  const [{ data: commentsData, loading: commentLoading }, executeGetComments] = useAxios(
    {
      url: API_PATH.GetDramaVideoComments,
      method: 'GET',
      params: {
        vid,
      },
    },
    { manual: true },
  );

  useEffect(() => {
    document.getElementsByTagName('xg-controls')[0]?.classList.add('no-swipe');
  }, []);

  useEffect(() => {
    dispatch(setDetail(video_meta ?? {}));
  }, [video_meta]);

  // useEffect(() => {
  //   if (isRecommend) {
  //     return;
  //   }
  //   if (current) {
  //     toastRef?.current?.close();
  //   } else {
  //     toastRef.current = Toast.show({
  //       icon: 'loading',
  //       content: '加载中…',
  //       duration: 0,
  //     });
  //   }
  // }, [current, isRecommend]);

  useEffect(() => {
    return () => {
      toastRef.current?.close();
    };
  }, []);

  return loading ? (
    <div className={styles.loadingWrapper}>
      <Loading />
    </div>
  ) : (
    <div className={styles.wrap}>
      <VideoSwiper
        startTime={startTime}
        isChannelActive={isChannelActive}
        isChannel={isChannel}
        videoDataList={videoDataList.map(item => item.video_meta)}
        isSliderMoving={isSliderMoving}
        onChange={setActiveIndex}
        onProgressDrag={onProgressDrag}
        onProgressDragend={onProgressDragend}
        otherComponent={
          <div className={styles.channelBottom}>
            <div className={styles.laneWrapper}>
              <div className={styles.bottomLane}>
                {display_type === CHANNEL_MODE.NORMAL ? (
                  <div className={styles.mode1}>
                    <div
                      className={styles.briefWrapper}
                      onClick={() => {
                        navigate(`/dramaDetail?id=${drama_id}`);
                      }}
                    >
                      <IconDrama />
                      <span className={styles.brief}>
                        {t('d_short_drama_placeholder', drama_title)}
                        {}
                      </span>
                    </div>
                    <div className={styles.info}>
                      <span className={styles.author}>@{name}</span>
                      <span className={styles.title}>
                        {drama_title} | {drama_length} | {caption}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mode2}>
                    <div className={styles.info}>
                      <img src={drama_cover_url} />
                      <div className={styles.title}>
                        <h2>{drama_title}</h2>
                        <span className={styles.popularity}>
                          <IconFire />
                          <span className={styles.num}>{renderCount(play_times)}</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={styles.btn}
                      onClick={() => {
                        const startTime = window.playerSdk?.player?.currentTime || 0;
                        const queryStartTime = `&startTime=${startTime}`;
                        navigate(`/dramaDetail?id=${drama_id}&order=${order}${queryStartTime}`);
                      }}
                    >
                      {t('d_play_now')}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.rightLane}>
                <div className={styles.btns}>
                  <div className={styles.avatar}>
                    <div>
                      <img src={Avatar} alt="" />
                    </div>
                  </div>
                  <div className={styles.like}>
                    <LikeComp like={like} />
                  </div>
                  <div
                    className={styles.comment}
                    onClick={e => {
                      e.stopPropagation();
                      setCommentVisible(true);
                      executeGetComments();
                    }}
                  >
                    <IconComment />
                    <span>{renderCount(comment)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.recommendBrief}
              onClick={() => {
                setPopupVisible(true);
              }}
            >
              <div className={styles.left}>
                <IconRcm />
                <span>{t('d_recommend_for_you')}</span>
              </div>
              <IconEnter />
            </div>
          </div>
        }
      />

      <Popup
        visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false);
        }}
        getContainer={() => document.getElementById('channel')!}
        bodyClassName={styles.popupBodyClass}
        maskClassName={styles.popupMaskClass}
      >
        <div className={styles.head}>
          <div className={styles.title}>
            <IconRcm />
            <span>{t('d_recommend_for_you')}</span>
          </div>
          <div
            className={styles.close}
            onClick={() => {
              setPopupVisible(false);
            }}
          >
            <IconClose />
          </div>
        </div>
        <div className={classNames(styles.body)}>
          {videoDataList?.map((video, index) => {
            const item = video.video_meta ?? {};
            return (
              <div
                className={classNames(styles.card, { [styles.selected]: index === activeIndex })}
                key={item.vid}
                onClick={() => {
                  let queryStartTime = '';
                  if (item.order === order) {
                    const startTime = window.playerSdk?.player?.currentTime || 0;
                    queryStartTime = `&startTime=${startTime}`;
                  }
                  navigate(`/dramaDetail?id=${item.drama_id}&order=${item.order}${queryStartTime}`);
                }}
              >
                <div className={styles.img}>
                  <img src={item.cover_url} alt="" />
                </div>
                <div className={styles.content}>
                  <h2>{item.caption}</h2>
                  <div className={styles.info}>
                    <span className={styles.time}>{formatSecondsToTime(parseInt(String(item.duration)))}</span>
                    <span className={styles.popularity}>
                      <IconFire />
                      <span className={styles.num}>{renderCount(item.play_times)}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Popup>

      <CommentComp
        commentVisible={commentVisible}
        setCommentVisible={setCommentVisible}
        list={commentsData?.response ?? []}
        loading={commentLoading}
      />
    </div>
  );
};

export default Channel;
