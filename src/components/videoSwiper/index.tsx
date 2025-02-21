import styles from './index.module.less';
import SliderItem from '@/components/sliderItem';
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
import SystemCover from '../systemCover';

const getClass: (player: PlayerCore) => HTMLDivElement = (player: PlayerCore) =>
  player.root?.getElementsByClassName('xgplayer-start')[0];

interface IVideoSwiperProps {
  videoDataList: IDramaDetailListItem['video_meta'][];
  isChannel?: boolean;
  isChannelActive?: boolean;
  isSliderMoving?: boolean;
  startTime?: number;
  initActiveIndex?: number;
  playbackRate?: number;
  definition?: string;
  otherComponent: React.ReactNode;
  onChange: (v: number) => any;
  onProgressDrag?: () => void;
  onProgressDragend?: () => void;
  showLockPrompt?: () => void;
  playLockVideo?: () => void;
  changeNum?: (value: number) => void;
}

export interface RefVideoSwiper {
  onSelectClick: (index: number) => void;
  playLockVideo: () => void;
}

const VideoSwiper = React.forwardRef<RefVideoSwiper, IVideoSwiperProps>(
  (
    {
      isChannel = false,
      isChannelActive,
      isSliderMoving,
      startTime = 0,
      playbackRate = 1,
      onChange,
      definition = '720p',
      onProgressDrag,
      onProgressDragend,
      videoDataList,
      otherComponent,
      showLockPrompt,
      initActiveIndex,
      changeNum,
    },
    ref,
  ) => {
    const swiperRef = useRef<SwiperClass>();
    const swiperActiveRef = useRef<number>(initActiveIndex || 0);
    const prevSwiperActiveRef = useRef<number>(swiperActiveRef.current);
    const wrapRef = useRef<HTMLElement>();
    const sdkRef = useRef<VePlayer>();
    const dispatch = useDispatch();
    const refVip = useRef(false);
    const refStartTime = useRef(0);
    const refEndTime = useRef(0);
    const refNeedPause = useRef(false);
    const [playNextStatus, setPlayNextStatus] = useState<string>('');
    const [showUnmuteBtn, setShowUnmuteBtn] = useState<boolean>(false);
    const [showSystemCover, setShowSystemCover] = useState<boolean>(false);
    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(initActiveIndex || 0);
    const currentVideoData = videoDataList?.[activeIndex];
    const isPortrait = currentVideoData.height > currentVideoData.width;
    const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
    const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);

    refNeedPause.current = refVip.current || (!isChannelActive && isChannel);

    useEffect(() => {
      swiperRef.current && (swiperRef.current.allowTouchMove = !(isFullScreen || isCssFullScreen));
    }, [isFullScreen, isCssFullScreen]);

    useEffect(() => {
      dispatch(setIsPortrait(isPortrait));
    }, [isPortrait]);

    useEffect(() => {
      refEndTime.current = 0;
      refStartTime.current = new Date().valueOf();
    }, [activeIndex]);

    /**
     * Show the mute button
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
      if (value) {
        document.body.classList.add('fullscreen');
      } else {
        document.body.classList.remove('fullscreen');
      }
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
      // Screen rotation monitoring
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
     * Next video of the player
     * @param {number} index - Current swiper index
     */
    const playNext = useCallback(
      (index: number, vipCanPlay?: boolean) => {
        if (index < 0 || index >= videoDataList.length) {
          return;
        }
        const next = videoDataList?.[index];

        // Play after VIP unlock or non-VIP video
        if (sdkRef.current && (index !== swiperActiveRef.current || vipCanPlay)) {
          if (os.isIos) {
            setActiveIndex(index);
          } else {
            !isFullScreen && setActiveIndex(index);
          }
          prevSwiperActiveRef.current = swiperActiveRef.current;
          swiperActiveRef.current = index;

          if (next.vip) {
            swiperRef.current?.slideTo(index, 0);
            sdkRef.current?.player?.pause();
            refVip.current = true;
            os.isAndroid && isFullScreen && setShowSystemCover(true);
            showLockPrompt?.();
            return;
          }
          refVip.current = false;
          setShowSystemCover(false);

          setPlayNextStatus('start');
          const nextInfo = formatPreloadStreamList([videoDataList?.[index]], definition)[0];
          const poster = next?.videoModel?.PosterUrl ?? next.cover_url;
          swiperRef.current?.slideTo(index, 0);
          sdkRef.current?.player?.pause();
          sdkRef.current?.getPlugin('poster')?.update(poster);
          if (!nextInfo?.url) {
            Toast.show({
              icon: 'fail',
              content: t('d_data_error'),
            });
            return;
          }
          attachStartIcon(sdkRef.current?.player);

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
              defaultDefinition: definition,
            })
            .then(() => sdkRef.current?.player?.play())
            .then(() => {
              setTimeout(() => hideStartIcon(sdkRef.current?.player), 0);
              setPlayNextStatus('end');
            });
        }
      },
      [attachStartIcon, hideStartIcon, videoDataList, activeIndex, isFullScreen, definition],
    );

    const onSlideChange = useCallback(
      (swiper: SwiperClass) => {
        if ((isFullScreen || isCssFullScreen) && !isPortrait) return;
        if (swiper.realIndex !== swiperActiveRef.current) {
          playNext(swiper.realIndex);
        }
      },
      [playNext, isFullScreen, isPortrait],
    );

    const onEnded = useCallback(() => {
      if (swiperRef.current?.activeIndex === videoDataList.length - 1) {
        Toast.show({
          content: t('d_data_over'),
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
          loop: true,
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
            // Background color of the completed part of the progress bar
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
            line_app_id: 597335, // Obtain from the video-on-demand console - VOD SDK - Application Management. Create one if not available.
          },
        };
        const playerSdk = new VePlayer(options as IPlayerConfig);
        window.playerSdk = playerSdk;
        playerSdk.once(Events.COMPLETE, () => {
          setPlayerReady(true);
        });
        playerSdk.once(Events.PLAY, showUnmute);
        playerSdk.once(Events.AUTOPLAY_PREVENTED, showUnmute);
        playerSdk.on(Events.TIME_UPDATE, () => {
          if (refNeedPause.current) {
            sdkRef.current?.player?.pause();
          }
        });
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

    // Initialize the player when the component is loaded
    useEffect(() => {
      setTimeout(() => {
        initPlayer();
      });
    }, [currentVideoData, activeIndex, initPlayer]);

    useEffect(() => {
      // Preload only supports PC and Android
      if (!(os.isPc || os.isAndroid)) {
        return;
      }
      // Preload enabled scenarios: Recommend page and active state; Enter short drama details page
      if ((isChannel && isChannelActive) || !isChannel) {
        VePlayer.setPreloadScene(1, {
          prevCount: 1,
          nextCount: 2,
        });
        // Set the list to be preloaded
        VePlayer.preloader?.clearPreloadList();
        VePlayer.setPreloadList(formatPreloadStreamList(videoDataList, definition) as IPreloadStream[]);
      }
    }, [isChannel, isChannelActive, videoDataList.filter(item => !item.vip).length, definition]); // The video after unlocking VIP also needs to be preloaded

    // Destroy the player when the component is unloaded
    useEffect(() => {
      return () => {
        if (sdkRef.current) {
          os.isIos ? window.playerSdk?.player?.exitCssFullscreen() : window.playerSdk?.player?.exitFullscreen();
          sdkRef.current.destroy();
        }
      };
    }, []);

    useEffect(() => {
      if (!sdkRef.current && !currentVideoData.vip) {
        return;
      }
      onChange(activeIndex);
      const playerDom = sdkRef.current?.playerContainer;
      const insertParentNode = document.getElementById(`video-with-rotate-btn-${activeIndex}`);
      if (insertParentNode && playerDom && playerDom.parentNode) {
        playerDom.parentNode!.style.height = isPortrait
          ? '100%'
          : `calc(${currentVideoData.height / currentVideoData.width} * 100vw)`;
        insertParentNode?.insertBefore(playerDom.parentNode, null);
      }
    }, [activeIndex, currentVideoData.vip]);

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
      // Play after unlocking
      playLockVideo: () => {
        if (!refVip.current) return;
        playNext(swiperActiveRef.current, true);
      },
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
                        isPortrait={isPortrait}
                        otherComponent={otherComponent}
                        getCurrentTime={getCurrentTime}
                        goBack={() => {
                          changeNum?.(prevSwiperActiveRef.current);
                        }}
                        clickCallback={() => {
                          if (currentVideoData.vip) {
                            showLockPrompt?.();
                          }
                        }}
                      >
                        {!currentVideoData.vip && (
                          <PlayContol
                            videoData={currentVideoData}
                            playerReady={playerReady}
                            index={i}
                            isFullScreen={isFullScreen}
                            switchFullScreen={() => {
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
          {showSystemCover && (
            <SystemCover
              imgUrl={videoDataList[swiperActiveRef.current].cover_url}
              clickCallback={() => {
                showLockPrompt?.();
              }}
              goBack={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                changeNum?.(prevSwiperActiveRef.current);
              }}
            />
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
  switchFullScreen: () => void;
  showUnmuteBtn: boolean;
  isFullScreen: boolean;
}

const PlayContol: React.FC<IPlayControlProps> = ({
  videoData,
  playerReady,
  activeIndex,
  index,
  onUnmuteClick,
  switchFullScreen,
  showUnmuteBtn,
  isFullScreen,
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
        onClick={switchFullScreen}
      >
        <IconRotate />
        <span>{t('d_full_screen')}</span>
      </div>
      {showUnmuteBtn && !isFullScreen && (
        <div
          className={styles.unmute}
          onClick={onUnmuteClick}
          style={{
            height: isLandScapeMode ? `calc(${videoData.height / videoData.width} * 100vw)` : '100%',
          }}
        >
          <div className={styles.unmuteBtn}>
            <IconUnmute className={styles.unmuteIcon} />
            <span>{t('d_click_to_unmute')}</span>
          </div>
        </div>
      )}
      {activeIndex === index && (
        <div
          id="veplayer-container"
          className="veplayer-container"
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
