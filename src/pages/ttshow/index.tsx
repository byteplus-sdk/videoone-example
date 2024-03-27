import React, { useEffect, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import Player from '@/components/player';
import { Swiper, SwiperSlide } from 'swiper/react';
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
  const refSwiper = useRef<any>();
  const indexRef = useRef<number>();
  const [{ data, loading }] = useAxios({
    url: API_PATH.GetFeedStreamWithPlayAuthToken,
    method: 'POST',
    data: {
      params: {
        offset: 0,
        pageSize: 20,
        videoType: 1,
      },
    },
  });
  const list = (data?.response as IVideo[]) ?? [];
  const [isTouch, setTouch] = useState(false);
  const [isFirstSlide, setFirstSlide] = useState(true);
  const [showUnmuteBtn, setShowUnmuteBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      initVePlayer();
    });
  }, [list]);

  function initVePlayer() {
    const { playAuthToken = '', coverUrl = '' } = list[0] || {};
    if (!playerSDKins.current && playAuthToken) {
      playerSDKins.current = new window.VePlayer({
        el: document.querySelector('#veplayerContainer'),
        getVideoByToken: {
          playAuthToken,
          defaultDefinition: '480p',
        },
        poster: coverUrl,
        autoplay: true,
        enableDegradeMuteAutoplay: true,
        closeVideoClick: false,
        closeVideoDblclick: true,
        controls: false,
        ignores: ['moreButtonPlugin'],
        vodLogOpts: {
          vtype: 'MP4',
          tag: 'normal',
          codec_type: 'h264',
          line_app_id: 5627721,
        },
      });
      playerSDKins.current.on('ended', onEnded);
      playerSDKins.current.once('play', showUnmute);
      playerSDKins.current.once('autoplay_was_prevented', showUnmute);
    }
  }

  function playNext(activeIndex: number) {
    if (playerSDKins.current && activeIndex !== indexRef.current) {
      const next = list[activeIndex];
      const { playAuthToken = '' } = next;
      indexRef.current = activeIndex;
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

  function handleClick() {
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
    refSwiper.current.slideNext();
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
      <div onClick={handleClick}>
        {list.length > 0 && (
          <Swiper
            onSwiper={swiper => (refSwiper.current = swiper)}
            style={{ height: 'calc(100vh - 40px)' }}
            direction="vertical"
            preventClicksPropagation={false}
            loop={true}
            onSlideChange={swiper => {
              if (isFirstSlide && swiper.realIndex === 1) {
                setFirstSlide(false);
              }
              playNext(swiper.realIndex);
            }}
            onTouchMove={() => {
              setTouch(true);
            }}
          >
            {list.map((item: any, i: number) => {
              return (
                <SwiperSlide key={i}>
                  {({ isActive }) => <Player data={item} index={i} isTouch={isTouch} isActive={isActive} />}
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
      <div className={style.veplayerWrapper}>
        <div id="veplayerContainer" />
      </div>
      {isFirstSlide && (
        <div className={style.guide}>
          <img src={Gesture} alt="" />
          <span>{t('tt_guide')}</span>
        </div>
      )}
    </>
  );
};
export default TTShow;
