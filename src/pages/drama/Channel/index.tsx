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
import { useDispatch, useSelector } from 'react-redux';
import { imgUrl } from '@/utils';
import { RootState } from '@/redux/type';

interface IRecommend {
  isSliderMoving: boolean;
  videoDataList: IDramaDetailListItem[];
  loading: boolean;
  isChannel: boolean;
  isChannelActive: boolean;
}

interface ChannelProps extends IRecommend {
  isSliderMoving: boolean;
  videoDataList: IDramaDetailListItem[];
  loading: boolean;
  isChannel: boolean;
  isChannelActive: boolean;
}

const VideoInfo: React.FC<{
  drama_meta: any;
  video_meta: any;
  onNavigate: (startTime?: number) => void;
}> = React.memo(({ drama_meta, video_meta, onNavigate }) => {
  if (video_meta.display_type === CHANNEL_MODE.NORMAL) {
    return (
      <div className={styles.mode1}>
        <div className={styles.briefWrapper} onClick={() => onNavigate()}>
          <IconDrama />
          <span className={styles.brief}>{t('d_short_drama_placeholder', drama_meta.drama_title)}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.author}>@{video_meta.name}</span>
          <span className={styles.title}>
            {drama_meta.drama_title} | {drama_meta.drama_length} | {video_meta.caption}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mode2}>
      <div className={styles.info}>
        <img src={drama_meta.drama_cover_url} />
        <div className={styles.title}>
          <h2>{drama_meta.drama_title}</h2>
          <span className={styles.popularity}>
            <IconFire />
            <span className={styles.num}>{renderCount(video_meta.play_times)}</span>
          </span>
        </div>
      </div>
      <div
        className={styles.btn}
        onClick={() => {
          const startTime = window.playerSdk?.player?.currentTime || 0;
          onNavigate(startTime);
        }}
      >
        {t('d_play_now')}
      </div>
    </div>
  );
});

const VideoControls: React.FC<{
  like: number;
  comment: number;
  onCommentClick: () => void;
}> = React.memo(({ like, comment, onCommentClick }) => (
  <div className={styles.rightLane}>
    <div className={styles.btns}>
      <div className={styles.avatar}>
        <div>
          <img
            src={imgUrl(
              '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/f91bdb13eb83960457760d4f0be0b1e8.png~tplv-j963mrpdmh-image.image',
            )}
            alt=""
          />
        </div>
      </div>
      <div className={styles.like}>
        <LikeComp like={like} />
      </div>
      <div className={styles.comment} onClick={onCommentClick}>
        <IconComment />
        <span>{renderCount(comment)}</span>
      </div>
    </div>
  </div>
));

const Channel: React.FC<ChannelProps> = ({
  isSliderMoving,
  isChannel,
  videoDataList = [],
  loading,
  isChannelActive,
}) => {
  const [urlState] = useUrlState();
  const toastRef = useRef<ToastHandler>();
  const startTime = urlState.startTime || 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const refWrapper = useRef<HTMLDivElement>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentVideo = videoDataList[activeIndex] ?? {};
  const { drama_meta, video_meta } = currentVideo;
  const { comment, like, vid, order } = video_meta ?? {};
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
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

  const handleNavigate = React.useCallback(
    (startTime?: number) => {
      const queryStartTime = startTime ? `&startTime=${startTime}` : '';
      navigate(`/dramaDetail?id=${drama_meta.drama_id}&order=${order}${queryStartTime}&device_id=001`);
    },
    [drama_meta?.drama_id, order],
  );

  const handleCommentClick = React.useCallback(() => {
    setCommentVisible(true);
    executeGetComments();
  }, [executeGetComments]);

  useEffect(() => {
    dispatch(setDetail(video_meta ?? {}));
  }, [video_meta, dispatch]);

  useEffect(() => {
    return () => {
      toastRef.current?.close();
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.channel} ref={refWrapper}>
      <div className={styles.wrap}>
        <VideoSwiper
          startTime={startTime}
          isChannelActive={isChannelActive}
          isChannel={isChannel}
          videoDataList={videoDataList.map(item => item.video_meta)}
          isSliderMoving={isSliderMoving}
          onChange={setActiveIndex}
          otherComponent={
            isCssFullScreen ? null : (
              <div className={classNames(styles.channelBottom)}>
                <div className={styles.laneWrapper}>
                  <VideoInfo drama_meta={drama_meta} video_meta={video_meta} onNavigate={handleNavigate} />
                  <VideoControls like={like} comment={comment} onCommentClick={handleCommentClick} />
                </div>
              </div>
            )
          }
        />
      </div>
      {isCssFullScreen ? null : (
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
      )}

      <Popup
        visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false);
        }}
        getContainer={() => refWrapper.current!}
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
                  navigate(`/dramaDetail?id=${item.drama_id}&order=${item.order}${queryStartTime}&device_id=001`);
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

export default React.memo(Channel);
