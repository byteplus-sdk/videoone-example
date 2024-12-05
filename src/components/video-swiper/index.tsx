import styles from './index.module.less';
import SliderItem from '@/components/slider-item';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import VePlayer, { Events, IPlayerConfig, PlayerCore } from '@/player';
import { formatPreloadStreamList } from '@/utils/preload';
import { Toast } from 'antd-mobile';
import { IVideoDataWithModel } from '@/@types';
import { os, selectDef } from '@/utils';
import '@byteplus/veplayer/index.min.css';

const getClass: (player: PlayerCore) => HTMLDivElement = (player: PlayerCore) =>
  player.root?.getElementsByClassName('xgplayer-start')[0];

interface IVideoSwiperProps {
  videoDataList: IVideoDataWithModel[];
  isChannel?: boolean;
  isChannelActive?: boolean;
  isSliderMoving?: boolean;
  startTime?: number;
  otherComponent: React.ReactNode;
  onChange: (v: number) => any;
  onProgressDrag?: () => void;
  onProgressDragend?: () => void;
}

const preventDefault = (e: TouchEvent) => e?.preventDefault?.();

const VideoSwiper: React.FC<IVideoSwiperProps> = ({
  isChannel,
  isChannelActive,
  isSliderMoving,
  startTime = 0,
  onChange,
  onProgressDrag,
  onProgressDragend,
  videoDataList,
  otherComponent,
}) => {
  const swiperRef = useRef<SwiperClass>();
  const swiperActiveRef = useRef<number>(0);
  const wrapRef = useRef<HTMLElement>();
  const sdkRef = useRef<VePlayer>();
  const [playNextStatus, setPlayNextStatus] = useState<string>('');
  const [showUnmuteBtn, setShowUnmuteBtn] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const currentVideoData: IVideoDataWithModel = videoDataList?.[activeIndex];
  const navigate = useNavigate();

  /**
   * 展示静音按钮
   */
  const showUnmute = useCallback(() => {
    if (sdkRef.current?.player) {
      const player = sdkRef.current?.player;
      setShowUnmuteBtn(player.muted || player.media?.muted);
    }
  }, []);

  const onUnmuteClick = useCallback(() => {
    if (sdkRef.current?.player) {
      const player = sdkRef.current?.player;
      player.muted = false;
      player.play();
      setShowUnmuteBtn(false);
    }
  }, []);

  const hideStartIcon = useCallback((player?: PlayerCore) => {
    if (!player?.root) {
      return;
    }
    const startClassDom = getClass(player);
    if (startClassDom) {
      startClassDom.className = startClassDom.className
        ?.split(' ')
        .filter(item => item !== 'veplayer-h5-hide-start')
        .join(' ');
    }
  }, []);

  const attachStartIcon = useCallback((player: PlayerCore) => {
    if (!player?.root) {
      return;
    }
    const startClassDom = getClass(player);
    if (startClassDom) {
      startClassDom.className = `${startClassDom.className} veplayer-h5-hide-start`;
    }
  }, []);

  /**
   * 播放器下一个视频
   * @param {number} index - 当前swiper的index
   */
  const playNext = useCallback(
    (index: number) => {
      if (index < 0 || index >= videoDataList.length) {
        return;
      }
      if (sdkRef.current && index !== swiperActiveRef.current) {
        swiperActiveRef.current = index;
        setPlayNextStatus('start');
        const next = videoDataList?.[index];
        const nextInfo = formatPreloadStreamList([videoDataList?.[index]])[0];
        if (!nextInfo?.url) {
          Toast.show({
            icon: 'fail',
            content: '数据异常',
          });
          return;
        }
        const poster = next?.videoModel?.PosterUrl ?? next.cover_url;
        swiperRef.current?.slideTo(index, 0);
        setActiveIndex(index);
        sdkRef.current?.player?.pause();
        sdkRef.current?.getPlugin('poster')?.update(poster);
        attachStartIcon(sdkRef.current?.player);
        sdkRef.current
          ?.playNext({
            autoplay: true,
            vid: nextInfo.vid,
            playList: [nextInfo],
          })
          .then(() => sdkRef.current?.player?.play())
          .then(() => {
            setTimeout(() => hideStartIcon(sdkRef.current?.player), 0);
            setPlayNextStatus('end');
          });
      }
    },
    [attachStartIcon, hideStartIcon, videoDataList],
  );

  const onSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (swiper.realIndex !== swiperActiveRef.current) {
        playNext(swiper.realIndex);
      }
    },
    [playNext],
  );

  const onEnded = useCallback(() => {
    if (swiperRef.current?.activeIndex === videoDataList.length - 1) {
      Toast.show({
        content: '看完了！',
      });
    } else {
      swiperRef.current?.slideNext();
    }
  }, [videoDataList.length]);

  const initPlayer = useCallback(() => {
    if (!sdkRef.current && currentVideoData) {
      const playInfoList = currentVideoData?.videoModel?.PlayInfoList || [];
      const poster = currentVideoData?.videoModel?.PosterUrl ?? currentVideoData.cover_url;
      const def = selectDef(playInfoList, '720p');
      if (!def?.MainPlayUrl) {
        return;
      }
      const options = {
        id: 'veplayer-container',
        playList: [
          {
            url: def.MainPlayUrl,
            definition: def.Definition,
            codecType: def.Codec,
            bitrate: def.Bitrate,
            vtype: 'MP4',
          },
        ],
        vid: currentVideoData.vid,
        startTime,
        autoplay: !isChannel,
        enableDegradeMuteAutoplay: true,
        closeVideoClick: false,
        closeVideoDblclick: true,
        videoFillMode: 'fillWidth',
        codec: def.Codec,
        enableMp4MSE: true,
        ignores: [
          'moreButtonPlugin',
          'enter',
          'fullscreen',
          'volume',
          'progress',
          'play',
          'time',
          'pip',
          'replay',
          'playbackrate',
          'sdkDefinitionPlugin',
        ],
        commonStyle: {
          // 播放完成部分进度条底色
          playedColor: '#ffffff',
        },
        controls: {
          mode: 'bottom',
        },
        mobile: {
          gradient: 'none',
          darkness: false,
          disableGesture: isChannel,
          isTouchingSeek: false,
          gestureY: false,
        },
        adaptRange: {
          enable: true,
          minCacheDuration: 15,
          maxCacheDuration: 40,
        },
        progress: {
          onMoveStart: () => {
            sdkRef.current?.player?.plugins?.progress.focus();
          },
          onMoveEnd: () => {
            sdkRef.current?.player?.plugins?.progress.blur();
          },
        },
        sdkErrorPlugin: {
          isNeedRefreshButton: false,
        },
        start: {
          disableAnimate: true,
          isShowPause: true,
        },
        poster: {
          poster,
          hideCanplay: true,
          fillMode: 'fixWidth',
        },
        vodLogOpts: {
          vtype: 'MP4',
          tag: 'normal',
          codec_type: def.Codec,
          line_app_id: 597335, // 从视频点播控制台-点播SDK-应用管理 获取，如果没有应用则创建
        },
      };

      const playerSdk = new VePlayer(options as IPlayerConfig);
      window.playerSdk = playerSdk;
      playerSdk.once(Events.COMPLETE, () => {
        const player = playerSdk.player;
        if (isChannel) {
          // 通过插件实例调用
          player.getPlugin('progress').useHooks('dragstart', () => {
            /**
             * 如果返回false，则不执行默认逻辑
             * 如果返回true，则执行默认行为seek操作
             * */
            onProgressDrag && onProgressDrag();
            return true;
          });
          player.getPlugin('progress').useHooks('drag', () => {
            onProgressDrag && onProgressDrag();
            return true;
          });
          player.getPlugin('progress').useHooks('dragend', () => {
            onProgressDragend && onProgressDragend();
            return true;
          });
        } else {
          // 通过插件实例调用
          player.root?.addEventListener('touchmove', preventDefault);
        }
      });
      playerSdk.once(Events.PLAY, showUnmute);
      playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
      playerSdk.on(Events.ENDED, onEnded);

      sdkRef.current = playerSdk;
    }
  }, [currentVideoData, isChannel, onEnded, onProgressDrag, onProgressDragend, showUnmute, startTime]);

  // 组件加载时初始化播放器
  useEffect(() => {
    setTimeout(() => {
      initPlayer();
    });
  }, [currentVideoData, activeIndex, initPlayer]);

  useEffect(() => {
    // 预加载只支持PC、Android
    if (!(os.isPc || os.isAndroid)) {
      return;
    }
    // 预加载开启场景：推荐页且处于激活状态； 进入短剧详情页
    if ((isChannel && isChannelActive) || !isChannel) {
      VePlayer.setPreloadScene(1, {
        prevCount: 1,
        nextCount: 2,
      });
      // 待预加载列表设置
      VePlayer.setPreloadList(formatPreloadStreamList(videoDataList));
    }
  }, [isChannel, isChannelActive, videoDataList]);

  // 组件卸载时销毁播放器
  useEffect(() => {
    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
        sdkRef.current?.player?.root?.removeEventListener('touchmove', preventDefault);
      }
    };
  }, []);

  useEffect(() => {
    if (!sdkRef.current) {
      return;
    }
    onChange(activeIndex);
    const playerDom = sdkRef.current?.playerContainer;
    const insertParentNode = document.getElementById(`swiper-video-container-${activeIndex}`);
    if (insertParentNode && playerDom) {
      insertParentNode?.insertBefore(playerDom, null);
    }
  }, [activeIndex, onChange]);

  useEffect(() => {
    if (isChannel) {
      if (isChannelActive) {
        if (isSliderMoving) {
          sdkRef.current?.player?.pause();
        } else {
          sdkRef.current?.player?.play();
        }
      } else {
        sdkRef.current?.player?.pause();
      }
    }
  }, [isChannel, isChannelActive, isSliderMoving]);

  const onSelectClick = useCallback(
    (index: number) => {
      playNext(index);
    },
    [playNext],
  );

  const getCurrentTime = useCallback(() => {
    return sdkRef?.current?.player?.currentTime || 0;
  }, []);

  return (
    <div className={isChannel ? styles.recommendMain : styles.main}>
      <div className={styles.swiperContainer} ref={wrapRef as React.MutableRefObject<HTMLDivElement>}>
        {videoDataList?.length > 0 && (
          <Swiper
            className={styles.mySwiper}
            direction="vertical"
            onSwiper={swiper => (swiperRef.current = swiper)}
            onActiveIndexChange={onSlideChange}
          >
            {videoDataList.map((item: any, i: number) => {
              return (
                <SwiperSlide key={`${item.id}-${i}`}>
                  {({ isActive }) => (
                    <SliderItem
                      key={item.id}
                      data={item}
                      index={i}
                      playNextStatus={playNextStatus}
                      isActive={isActive}
                      activeIndex={activeIndex}
                      otherComponent={otherComponent}
                      //   isRecommend={isRecommend}
                      getCurrentTime={getCurrentTime}
                    >
                      {activeIndex === 0 && <div id="veplayer-container" className="veplayer-container"></div>}
                    </SliderItem>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default VideoSwiper;
