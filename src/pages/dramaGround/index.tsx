import React, { useEffect, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import Slider, { Settings } from 'react-slick';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/less';
import styles from './index.module.less';
import { IVideo } from '@/interface';
import Gesture from '@/assets/images/gesture.png';
import PlayIcon from '@/assets/svgr/iconPlay.svg?react';
import BackIcon from '@/assets/svgr/back.svg?react';
import FireIcon from '@/assets/svgr/iconFire.svg?react';

import { useNavigate } from 'react-router-dom';
import t from '@/utils/translation';
import Loading from '@/components/loading';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ILoop {
  drama_cover_url: string;
  drama_id: string;
  drama_play_times: number;
  drama_title: string;
}

const DramaGround: React.FC = () => {
  const navigate = useNavigate();

  const [{ data, loading }, executeGetDramaChannel] = useAxios(
    {
      url: API_PATH.GetDramaChannel,
      method: 'POST',
    },
    { manual: true },
  );

  useEffect(() => {
    document.body.style.background = '#161823';
    executeGetDramaChannel();
  }, []);

  const settings: Settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    arrows: false,
    dots: true,
    dotsClass: styles.slickDots,
    customPaging: function () {
      return <div className="dotWrapper"></div>;
    },
    autoplay: true,
  };

  // const { (loop as ILoop[]), trending, new: _new, recommend } = data.response;
  const loopData = (data?.response?.loop as ILoop[]) ?? [];
  const trending = (data?.response?.trending as ILoop[]) ?? [];
  const recommend = (data?.response?.recommend as ILoop[]) ?? [];
  return loading ? (
    <div className={styles.loadingWrapper}>
      <Loading />
    </div>
  ) : (
    <div className={styles.dramaGroundContainer}>
      <div className={styles.back} onClick={() => navigate('/')}>
        <BackIcon />
      </div>
      {/* 轮播 */}
      <div className={styles.carousel}>
        <Slider {...settings}>
          {loopData.map(item => {
            return (
              <div key={item.drama_id}>
                <div className="carouselItemWrapper" style={{ background: `url(${item.drama_cover_url})` }}>
                  <div className="btn">
                    <PlayIcon style={{ marginRight: 6 }} />
                    立即播放
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
      {/* 趋势 */}
      <div className={styles.trendingWrapper}>
        <h1 className={styles.tit}>Most trending 🔥</h1>
        <div className={styles.trendingContentWrapper}>
          {trending.map((item, index) => {
            return (
              <div key={item.drama_id} className={styles.trendingItemWrapper}>
                <div className={styles.coverWrapper}>
                  <img src={item.drama_cover_url} />
                  {index < 3 ? (
                    <span className={styles.tagTop}>TOP{index + 1}</span>
                  ) : (
                    <span className={styles.tagNum}>{index + 1}</span>
                  )}
                </div>
                <div className={styles.contentWrapper}>
                  <h2>{item.drama_title}</h2>
                  <div className={styles.popularity}>
                    <FireIcon />
                    <span className={styles.num}>920.6w</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 趋势 */}
      <div className={styles.recommendWrapper}>
        <h1 className={styles.tit}>New release</h1>
        <div className={styles.recommendContentWrapper}>
          {recommend.map((item, index) => {
            return (
              <div key={item.drama_id} className={styles.recommendItemWrapper}>
                <div className={styles.coverWrapper}>
                  <img src={item.drama_cover_url} />
                  {index === 0 && <div className={styles.newTag}>NEW</div>}
                  <div className={styles.playNum}>
                    <PlayIcon />
                    <span>29.3w</span>
                  </div>
                </div>
                <div className={styles.contentWrapper}>
                  <h2>{item.drama_title}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default DramaGround;
