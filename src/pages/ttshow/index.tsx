import React, { useEffect, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import Player from '@/components/player';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/less';
import style from './index.module.less';
import { IVideo } from '@/interface';
import Gesture from '@/assets/images/gesture.png';
import NavIcon from '@/assets/svgr/navIcon.svg?react';
import BackIcon from '@/assets/svgr/back.svg?react';
import { useNavigate } from 'react-router-dom';
import t from '@/utils/translation';
import Loading from '@/components/loading';

const TTShow: React.FC = () => {
  const playerSDKins = useRef<any>();
  const refSwiper = useRef<SwiperClass>();
  const playerRef = useRef<any>(null);
  const refTimer = useRef<number>();
  const indexRef = useRef<number>();
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
  const [isTouch, setTouch] = useState(false);
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

  function initVePlayer() {
    const { playAuthToken = '', coverUrl = '' } = list[0] || {};
    if (!playerSDKins.current && playAuthToken) {
      playerSDKins.current = new window.VePlayer({
        el: document.querySelector('#veplayerContainer'),
        getVideoByToken: {
          playAuthToken,
          defaultDefinition: '480p',
        },
        poster: {
          poster: coverUrl,
          hideCanplay: true,
        },
        autoplay: true,
        loop: true,
        enableDegradeMuteAutoplay: true,
        closeVideoClick: false,
        closeVideoDblclick: true,
        controls: false,
        ignores: ['moreButtonPlugin', 'enter', 'start'],
        start: {
          disableAnimate: true,
        },
        vodLogOpts: {
          vtype: 'MP4',
          tag: 'normal',
          codec_type: 'h264',
          line_app_id: 5627721,
        },
      });
      playerSDKins.current.on('ended', onEnded);
      playerSDKins.current.once('play', () => {
        setOncePlay(true);
        showUnmute();
      });
      playerSDKins.current.once('autoplay_was_prevented', showUnmute);
    }
  }

  function playNext(activeIndex: number) {
    if (playerSDKins.current && activeIndex !== indexRef.current) {
      const next = list[activeIndex];
      const { playAuthToken = '', coverUrl } = next;
      indexRef.current = activeIndex;
      playerSDKins.current?.player.plugins.poster.update(coverUrl);
      playerSDKins.current
        .playNext({
          autoplay: true,
          getVideoByToken: {
            playAuthToken,
            defaultDefinition: '480p',
          },
        })
        .then(() => {
          setTouch(false);
        });
    } else {
      setTouch(false);
    }
  }

  function pauseOrPlay() {
    if (playerSDKins.current) {
      const player = playerSDKins.current.player;
      if (player.muted) {
        return;
      }
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    }
  }

  function onEnded() {
    // refSwiper.current?.slideNext();
  }

  function jumpToApp() {
    window.location.href = 'https://docs.byteplus.com/en/docs/byteplus-vos/docs-byteplus-videoone-demo-app_1';
  }

  function showUnmute() {
    const player = playerSDKins.current.player;
    if (player.muted || player.video.muted) {
      setShowUnmuteBtn(true);
    }
  }

  function onUnmuteClick() {
    const player = playerSDKins.current.player;
    player.muted = false;
    setShowUnmuteBtn(false);
  }

  function handleMaskClose() {
    clearTimeout(refTimer.current);
    setShowGuide(false);
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className={style.topArea}>
        {showUnmuteBtn && (
          <div className={style.unmute} onClick={onUnmuteClick}>
            <div className={style.unmuteBt}>{t('tt_unmute')}</div>
          </div>
        )}
        <div className={style.back} onClick={() => navigate('/')}>
          <BackIcon />
        </div>
        <div className={style.infoWrapper}>
          <NavIcon />
          <div className={style.info}>
            <p className={style.tit}>{t('tt_nav_tit')}</p>
            <p className={style.desc}>{t('tt_nav_desc')}</p>
          </div>
        </div>
        <div className={style.btn} onClick={jumpToApp}>
          {t('tt_nav_btn')}
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
            onSliderMove={() => {
              setTouch(true);
            }}
          >
            {list.map((item: any, i: number) => {
              return (
                <SwiperSlide key={i}>
                  {({ isActive }) => (
                    <Player
                      ref={isActive ? playerRef : null}
                      data={item}
                      index={i}
                      isTouch={isTouch}
                      isActive={isActive}
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
      <div className={style.veplayerWrapper}>
        <div id="veplayerContainer" />
      </div>
      {showGuide && (
        <div className={style.guide} onClick={handleMaskClose} onTouchMove={handleMaskClose}>
          <img src={Gesture} alt="" />
          <span>{t('tt_guide')}</span>
        </div>
      )}
    </>
  );
};
export default TTShow;
