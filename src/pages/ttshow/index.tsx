import React, { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import Player from '@/components/player';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/less';
import style from './index.module.less';
import { IVideo } from '@/interface';
import Gesture from '@/assets/images/gesture.png';
import IconNav from '@/assets/svgr/iconNavIcon.svg?react';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import { useNavigate } from 'react-router-dom';
import t from '@/utils/translation';
import Loading from '@/components/loading';
import VePlayer, { PlayerCore } from '@/player';

const getClass: (player: PlayerCore) => HTMLDivElement = (player: PlayerCore) =>
  player.root?.getElementsByClassName('xgplayer-start')[0];

const TTShow: React.FC = () => {
  const playerSDKins = useRef<VePlayer>();
  const refSwiper = useRef<SwiperClass>();
  const playerRef = useRef<any>(null);
  const refTimer = useRef<number>();
  const indexRef = useRef<number>(0);
  const [oncePlay, setOncePlay] = useState(false);

  const [{ data, loading }, executeGetVideos] = useAxios(
    {
      url: API_PATH.GetFeedStreamWithPlayAuthToken,
      method: 'POST',
      data: {
        params: {
          offset: 0,
          pageSize: 50,
          videoType: 1,
        },
      },
    },
    { manual: true },
  );

  const list = (data?.response as IVideo[]) ?? [];
  const [isFirstSlide, setFirstSlide] = useState(true);
  const [showUnmuteBtn, setShowUnmuteBtn] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      initVePlayer();
    });
  }, [list]);

  useEffect(() => {
    if (isFirstSlide && oncePlay) {
      setShowGuide(true);
      refTimer.current = setTimeout(() => {
        setShowGuide(false);
      }, 5000);
    } else {
      setShowGuide(false);
    }
  }, [isFirstSlide, oncePlay]);

  useEffect(() => {
    executeGetVideos();
    return () => {
      playerSDKins.current?.destroy();
      refSwiper.current?.destroy();
    };
  }, []);

  const handleClick = (function () {
    let times = 0;
    const timeout = 300;
    return () => {
      times++;
      if (times === 1) {
        setTimeout(function () {
          if (times === 1) {
            pauseOrPlay();
          } else {
            playerRef.current?.likeRef.current.handleLike();
          }
          times = 0;
        }, timeout);
      }
    };
  })();

  /**
   * 初始化播放器，并对播放器内部抛出事件处理
   */
  function initVePlayer() {
    const { playAuthToken = '', coverUrl = '' } = list[0] || {};
    if (!playerSDKins.current && playAuthToken) {
      playerSDKins.current = new VePlayer({
        el: document.querySelector('#veplayer-container') as HTMLElement,
        getVideoByToken: {
          playAuthToken,
          defaultDefinition: '480p',
        },
        poster: {
          poster: coverUrl,
          hideCanplay: true,
          fillMode: 'contain',
        },
        mobile: {
          gradient: 'none',
        },
        autoplay: true,
        loop: true,
        enableDegradeMuteAutoplay: true,
        closeVideoClick: false,
        closeVideoDblclick: true,
        controls: false,
        ignores: ['moreButtonPlugin', 'enter'],
        start: {
          disableAnimate: true,
          isShowPause: true,
        },
        vodLogOpts: {
          vtype: 'MP4',
          tag: 'normal',
          codec_type: 'h264',
          line_app_id: 5627721,
        },
      });

      playerSDKins.current.once('play', () => {
        setOncePlay(true);
        showUnmute();
      });
      playerSDKins.current.once('autoplay_was_prevented', showUnmute);
    }
  }

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
   * @param {number} activeIndex - 当前swiper的index
   */
  function playNext(activeIndex: number) {
    if (playerSDKins.current && activeIndex !== indexRef.current) {
      const next = list[activeIndex];
      const { playAuthToken = '', coverUrl } = next;
      indexRef.current = activeIndex;
      playerSDKins.current?.player?.pause();
      playerSDKins.current?.getPlugin('poster')?.update(coverUrl);

      attachStartIcon(playerSDKins.current?.player);
      playerSDKins.current
        .playNext({
          autoplay: true,
          getVideoByToken: {
            playAuthToken,
            defaultDefinition: '480p',
            needPoster: true,
          },
        })
        .then(() => {
          const playerDom = document.querySelector('#veplayer-container');
          const insertParentNode = document.getElementById(`swiper-video-container-${activeIndex}`);
          if (insertParentNode && playerDom) {
            insertParentNode?.insertBefore(playerDom, null);
          }
          playerSDKins.current?.player?.play();
        })
        .then(() => {
          setTimeout(() => hideStartIcon(playerSDKins.current?.player), 0);
        });
    }
  }

  /**
   * 点击swiper实现暂停/播放器操作
   */
  function pauseOrPlay() {
    if (playerSDKins.current) {
      const player = playerSDKins.current.player;
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    }
  }

  /**
   * 点击获取应用跳转官网文档
   */
  function jumpToApp() {
    window.open('//docs.byteplus.com/en/docs/byteplus-vos/docs-byteplus-videoone-demo-app_1');
  }

  /**
   * 展示静音按钮
   */
  function showUnmute() {
    const player = playerSDKins?.current?.player;
    if (player.muted || player.video.muted) {
      setShowUnmuteBtn(true);
    } else {
      setShowUnmuteBtn(false);
    }
  }

  /**
   * 点击取消静音按钮
   */
  function onUnmuteClick() {
    const player = playerSDKins?.current?.player;
    player.muted = false;
    setShowUnmuteBtn(false);
  }

  function handleMaskClose() {
    clearTimeout(refTimer.current);
    setShowGuide(false);
  }

  return loading ? (
    <div className={style.loadingWrapper}>
      <Loading />
    </div>
  ) : (
    <>
      <div className={style.topArea}>
        {showUnmuteBtn && (
          <div className={style.unmute} onClick={onUnmuteClick}>
            <div className={style.unmuteBt}>{t('show_unmute')}</div>
          </div>
        )}
        <div className={style.back} onClick={() => navigate('/')}>
          <IconBack />
        </div>
        <div className={style.infoWrapper}>
          <IconNav />
          <div className={style.info}>
            <p className={style.tit}>{t('show_nav_tit')}</p>
            <p className={style.desc}>{t('show_nav_desc')}</p>
          </div>
        </div>
        <div className={style.btn} onClick={jumpToApp}>
          {t('show_nav_btn')}
        </div>
      </div>
      <div onClick={handleClick} className={style.mySwiper}>
        {list.length > 0 && (
          <Swiper
            onSwiper={swiper => (refSwiper.current = swiper)}
            style={{ height: '100%' }}
            direction="vertical"
            preventClicksPropagation={false}
            loop={true}
            onSlideChange={swiper => {
              if (isFirstSlide && swiper.realIndex === 1) {
                setFirstSlide(false);
              }
              playNext(swiper.realIndex);
            }}
          >
            {list.map((item: any, i: number) => {
              return (
                <SwiperSlide key={i}>
                  {({ isActive }) => <Player ref={isActive ? playerRef : null} data={item} index={i} />}
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {showGuide && (
        <div className={style.guide} onClick={handleMaskClose} onTouchMove={handleMaskClose}>
          <img src={Gesture} alt="" />
          <span>{t('show_guide')}</span>
        </div>
      )}
    </>
  );
};
export default TTShow;
