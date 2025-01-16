import styles from './index.module.less';
import SliderItem from '@/components/slider-item';
import React, { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import VePlayer, { Events, IPlayerConfig, PlayerCore } from '@/player';
import { formatPreloadStreamList } from '@/utils/preload';
import IconUnmute from '@/assets/svgr/iconUnmute.svg?react';
import { Toast } from 'antd-mobile';
import { IDramaDetailListItem } from '@/@types';
import { bindOrientationEvents, getIsLandscape, os, selectDef } from '@/utils';
import IconRotate from '@/assets/svgr/iconRotate.svg?react';
import '@byteplus/veplayer/index.min.css';
import classNames from 'classnames';
import ExpandRightPlugin from '@/plugins/expandRight';
import { useDispatch, useSelector } from 'react-redux';
import { setCssFullScreen, setFullScreen, setIsHorizontal, setIsPortrait } from '@/redux/actions/player';
import { RootState } from '@/redux/type';
import ExpandLeftPlugin from '@/plugins/expandLeft';
import { IPreloadStream, Stream } from '@byteplus/veplayer';
import { setDefinition } from '@/redux/actions/controls';
import t from '@/utils/translation';
import ExpandTopPlugin from '@/plugins/expandTop';

const getClass: (player: PlayerCore) => HTMLDivElement = (player: PlayerCore) =>
  player.root?.getElementsByClassName('xgplayer-start')[0];

interface IVideoSwiperProps {
  videoDataList: IDramaDetailListItem['video_meta'][];
  isChannel?: boolean;
  isChannelActive?: boolean;
  isSliderMoving?: boolean;
  adVisible?: boolean;
  startTime?: number;
  initActiveIndex?: number;
  playbackRate?: number;
  definition?: string;
  otherComponent: React.ReactNode;
  onChange: (v: number) => any;
  onProgressDrag?: () => void;
  onProgressDragend?: () => void;
  showLockPrompt?: () => void;
}

export interface RefVideoSwiper {
  onSelectClick: (index: number) => void;
}

const preventDefault = (e: TouchEvent) => e?.preventDefault?.();

const VideoSwiper = React.forwardRef<RefVideoSwiper, IVideoSwiperProps>(
  (
    {
      isChannel,
      isChannelActive,
      isSliderMoving,
      startTime = 0,
      playbackRate = 1,
      onChange,
      definition = '720p',
      adVisible,
      onProgressDrag,
      onProgressDragend,
      videoDataList,
      otherComponent,
      showLockPrompt,
      initActiveIndex,
    },
    ref,
  ) => {
    const swiperRef = useRef<SwiperClass>();
    const swiperActiveRef = useRef<number>(initActiveIndex || 0);
    const wrapRef = useRef<HTMLElement>();
    const sdkRef = useRef<VePlayer>();
    const dispatch = useDispatch();
    const refVip = useRef(false);
    const refStartTime = useRef(0);
    const refEndTime = useRef(0);
    const [playNextStatus, setPlayNextStatus] = useState<string>('');
    const [showUnmuteBtn, setShowUnmuteBtn] = useState<boolean>(false);
    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(initActiveIndex || 0);
    const currentVideoData = videoDataList?.[activeIndex];
    const isLandScapeMode = currentVideoData.height < currentVideoData.width;
    const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
    const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);

    useEffect(() => {
      swiperRef.current && (swiperRef.current.allowTouchMove = !(isFullScreen || isCssFullScreen));
    }, [isFullScreen, isCssFullScreen]);

    useEffect(() => {
      dispatch(setIsPortrait(!isLandScapeMode));
    }, [isLandScapeMode]);

    useEffect(() => {
      refEndTime.current = 0;
      refStartTime.current = new Date().valueOf();
    }, [activeIndex]);

    /**
     * 展示静音按钮
     */
    const showUnmute = useCallback(() => {
      if (sdkRef.current?.player) {
        const player = sdkRef.current?.player;
        setShowUnmuteBtn(player.muted || player.media?.muted);
      }
    }, []);

    const updateIsHorizontal = () => {
      const fullScreen = window.playerSdk.player.fullscreen;
      const isLandscape = getIsLandscape();
      if (fullScreen) {
        const isRotate = Boolean(window.playerSdk.player?.rotateDeg);
        dispatch(setIsHorizontal(isLandscape || isRotate));
      } else {
        dispatch(setIsHorizontal(isLandscape));
      }
    };

    const switchFullScreen = (value: boolean) => {
      if (!value) {
        setActiveIndex(swiperActiveRef.current);
      }
      dispatch(setFullScreen(value));
    };

    const switchCssFullScreen = (value: boolean) => {
      dispatch(setCssFullScreen(value));
    };

    const screenOrientation = () => {
      const handleOrientationChange = () => {
        // calcIsNeedFullPlayer();
        updateIsHorizontal();
      };

      bindOrientationEvents(true, handleOrientationChange);
      return () => {
        bindOrientationEvents(false, handleOrientationChange);
      };
    };

    useEffect(() => {
      // 屏幕旋转监听
      screenOrientation();
    }, []);

    const onUnmuteClick = useCallback(() => {
      if (sdkRef.current?.player) {
        const player = sdkRef.current?.player;
        player.muted = false;
        player.play();
        setShowUnmuteBtn(false);
      }
    }, []);

    useEffect(() => {
      if (sdkRef.current?.player) {
        sdkRef.current.player.playbackRate = playbackRate;
      }
    }, [playbackRate]);

    useEffect(() => {
      if (sdkRef.current && definition && (isCssFullScreen || isFullScreen)) {
        sdkRef.current.changeDefinition(definition);
      }
    }, [definition, isCssFullScreen, isFullScreen]);

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
      (index: number, vipCanPlay?: boolean) => {
        if (index < 0 || index >= videoDataList.length) {
          return;
        }
        const next = videoDataList?.[index];

        // vip解锁后或者非vip视频播放
        if (sdkRef.current && (index !== swiperActiveRef.current || vipCanPlay)) {
          if (os.isIos) {
            setActiveIndex(index);
          } else {
            !isFullScreen && setActiveIndex(index);
          }
          swiperActiveRef.current = index;
          setPlayNextStatus('start');
          const nextInfo = formatPreloadStreamList([videoDataList?.[index]], definition)[0];
          const poster = next?.videoModel?.PosterUrl ?? next.cover_url;
          swiperRef.current?.slideTo(index, 0);
          sdkRef.current?.player?.pause();
          sdkRef.current?.getPlugin('poster')?.update(poster);
          if (next.vip) {
            refVip.current = true;
            showLockPrompt?.();
            return;
          }
          if (!nextInfo?.url) {
            Toast.show({
              icon: 'fail',
              content: '数据异常',
            });
            return;
          }
          attachStartIcon(sdkRef.current?.player);
          dispatch(setDefinition(nextInfo.definition));
          sdkRef.current
            ?.playNext({
              autoplay: true,
              vid: nextInfo.vid,
              playList: videoDataList?.[index].videoModel.PlayInfoList.map(def => ({
                url: def.MainPlayUrl,
                definition: def.Definition,
                codecType: def.Codec,
                bitrate: def.Bitrate,
                vtype: 'MP4',
              })) as Stream[],
              defaultDefinition: nextInfo.definition,
            })
            .then(() => sdkRef.current?.player?.play())
            .then(() => {
              setTimeout(() => hideStartIcon(sdkRef.current?.player), 0);
              setPlayNextStatus('end');
            });
        }
      },
      [attachStartIcon, hideStartIcon, videoDataList, activeIndex, isFullScreen],
    );

    useEffect(() => {
      // 关闭广告后并且当前视频经过了vip解锁后可播放
      if (refVip.current && !currentVideoData.vip && !adVisible) {
        if (!sdkRef.current) {
          // 首个视频未解锁需要初始化播放器
          initPlayer();
        } else {
          // 已经初始化的话直接播放当前这条
          playNext(activeIndex, true);
        }
      }
    }, [currentVideoData.vip, adVisible]);

    const onSlideChange = useCallback(
      (swiper: SwiperClass) => {
        if ((isFullScreen || isCssFullScreen) && isLandScapeMode) return;
        if (swiper.realIndex !== swiperActiveRef.current) {
          playNext(swiper.realIndex);
        }
      },
      [playNext, isFullScreen, isLandScapeMode],
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
        if (currentVideoData.vip && !refVip.current) {
          refVip.current = true;
          showLockPrompt?.();
          return;
        }
        const playInfoList = currentVideoData?.videoModel?.PlayInfoList || [];
        const poster = currentVideoData?.videoModel?.PosterUrl ?? currentVideoData.cover_url;
        const def = selectDef(playInfoList, '720p');
        if (!def?.MainPlayUrl) {
          return;
        }
        dispatch(setDefinition(def.Definition));
        const options: IPlayerConfig = {
          id: 'veplayer-container',
          defaultDefinition: def.Definition,
          playList: playInfoList.map(def => {
            return {
              url: def.MainPlayUrl,
              definition: def.Definition,
              codecType: def.Codec,
              bitrate: def.Bitrate,
              vtype: 'MP4',
            };
          }),
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
            // 'progress',
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
          fullscreen: { rotateFullscreen: true, useCssFullscreen: os.isIos },
          ...(isChannel
            ? { plugins: [ExpandTopPlugin] }
            : { plugins: [ExpandRightPlugin, ExpandLeftPlugin, ExpandTopPlugin] }),
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
          setPlayerReady(true);
        });
        playerSdk.once(Events.PLAY, showUnmute);
        playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
        playerSdk.on(Events.ENDED, onEnded);
        playerSdk.on(Events.PLAY, () => {
          if (refEndTime.current === 0) {
            refEndTime.current = new Date().valueOf();
            window?.VideooneSlardar('sendEvent', {
              name: 'vod_wait_play',
              metrics: {
                ev_count: 1,
              },
              categories: {
                waitTime: refEndTime.current - refStartTime.current,
                vodInfo: JSON.stringify(videoDataList[swiperActiveRef.current]),
                hitpreload: playerSdk.getPlugin('mp4encryptplayer').hitpreload,
              },
            });
          }
        });
        playerSdk.on(Events.FULLSCREEN_CHANGE, switchFullScreen);
        playerSdk.on(Events.CSS_FULLSCREEN_CHANGE, switchCssFullScreen);

        sdkRef.current = playerSdk;
        window.playerSdk = sdkRef.current;
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
        VePlayer.preloader?.clearPreloadList();
        VePlayer.setPreloadList(formatPreloadStreamList(videoDataList, definition) as IPreloadStream[]);
      }
    }, [isChannel, isChannelActive, videoDataList.filter(item => !item.vip).length, definition]); // 解锁vip后的视频也需要预加载

    // 组件卸载时销毁播放器
    useEffect(() => {
      return () => {
        if (sdkRef.current) {
          sdkRef.current.destroy();
        }
      };
    }, []);

    useEffect(() => {
      if (!sdkRef.current) {
        return;
      }
      onChange(activeIndex);
      const playerDom = sdkRef.current?.playerContainer;
      const insertParentNode = document.getElementById(`videoWithRotateBtn${activeIndex}`);
      if (insertParentNode && playerDom && playerDom.parentNode) {
        playerDom.parentNode!.style.height = !isLandScapeMode
          ? '100%'
          : `calc(${currentVideoData.height / currentVideoData.width} * 100vw)`;
        insertParentNode?.insertBefore(playerDom.parentNode, null);
      }
    }, [activeIndex]);

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

    useImperativeHandle(ref, () => ({
      onSelectClick,
    }));

    const getCurrentTime = useCallback(() => {
      return sdkRef?.current?.player?.currentTime || 0;
    }, []);
    return (
      <div className={isChannel ? styles.recommendMain : styles.main}>
        <div className={styles.swiperContainer} ref={wrapRef as React.MutableRefObject<HTMLDivElement>}>
          {videoDataList?.length > 0 && (
            <Swiper
              initialSlide={activeIndex}
              className={classNames(styles.mySwiper, { [styles.hidePlayer]: currentVideoData.vip })}
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
                        isChannel={isChannel}
                        index={i}
                        playNextStatus={playNextStatus}
                        isActive={isActive}
                        activeIndex={activeIndex}
                        isFullScreen={isFullScreen}
                        isCssFullScreen={isCssFullScreen}
                        isLandScapeMode={isLandScapeMode}
                        otherComponent={otherComponent}
                        getCurrentTime={getCurrentTime}
                      >
                        {!currentVideoData.vip && (
                          <PlayContol
                            videoData={currentVideoData}
                            playerReady={playerReady}
                            index={i}
                            isFullScreen={isFullScreen}
                            swithFullScreen={() => {
                              os.isIos
                                ? sdkRef.current?.player?.getCssFullscreen()
                                : sdkRef.current?.player?.getFullscreen();
                            }}
                            showUnmuteBtn={showUnmuteBtn}
                            onUnmuteClick={onUnmuteClick}
                            activeIndex={activeIndex}
                          />
                        )}
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
  },
);

interface IPlayControlProps {
  videoData: IDramaDetailListItem['video_meta'];
  playerReady: boolean;
  activeIndex: number;
  index: number;
  onUnmuteClick: () => void;
  swithFullScreen: () => void;
  showUnmuteBtn: boolean;
  isFullScreen: boolean;
}
const PlayContol: React.FC<IPlayControlProps> = ({
  videoData,
  playerReady,
  activeIndex,
  isFullScreen,
  index,
  onUnmuteClick,
  swithFullScreen,
  showUnmuteBtn,
}) => {
  const isLandScapeMode = videoData.height < videoData.width;
  return (
    <>
      <div
        className={classNames(styles.rotateBtn, {
          [styles.hide]: !(isLandScapeMode && playerReady),
        })}
        style={{
          top: isLandScapeMode ? `calc(${videoData.height / videoData.width} * 100vw)` : 0,
        }}
        onClick={swithFullScreen}
      >
        <IconRotate />
        <span>{t('d_full_screen')}</span>
      </div>
      {showUnmuteBtn && (
        <div
          className={styles.unmute}
          onClick={onUnmuteClick}
          style={{
            top: isLandScapeMode ? `calc(${videoData.height / videoData.width} * 50vw)` : 0,
          }}
        >
          <div className={styles.unmuteBtn}>
            <IconUnmute className={styles.unmuteIcon} />
            <span>点击取消静音</span>
          </div>
        </div>
      )}
      {activeIndex === index && (
        <div
          id="veplayer-container"
          className={classNames('veplayer-container', {
            'is-landscape-mode': isLandScapeMode,
            'is-full-screen': isFullScreen,
          })}
          style={{
            width: '100%',
            height: isLandScapeMode ? `calc(${videoData.height / videoData.width} * 100vw)` : '100%',
          }}
        ></div>
      )}
    </>
  );
};

export default VideoSwiper;
