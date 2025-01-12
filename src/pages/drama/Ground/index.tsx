import React, { useRef } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import Slider, { Settings } from 'react-slick';
import 'swiper/less';
import styles from './index.module.less';
import IconPlay from '@/assets/svgr/iconPlay.svg?react';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import IconFire from '@/assets/svgr/iconFire.svg?react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';
import t from '@/utils/translation';
import { renderCount } from '@/utils/util';

interface IData {
  drama_cover_url: string;
  drama_id: string;
  drama_play_times: number;
  drama_title: string;
  new_release: boolean;
}

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

const Ground: React.FC = () => {
  const navigate = useNavigate();
  const refPreloadSet = useRef(new Set()) as React.MutableRefObject<Set<string>>;

  const [{ data, loading }] = useAxios({
    url: API_PATH.GetDramaChannel,
    method: 'POST',
  });

  const [, executePreload] = useAxios(
    {
      url: API_PATH.GetDramaList,
      method: 'POST',
    },
    { useCache: true, autoCancel: false, manual: true },
  );

  // 广场页的vid提前加载数据
  const handlePreload = (drama_id: string) => {
    if (!refPreloadSet.current.has(drama_id)) {
      executePreload({
        data: {
          drama_id: drama_id,
          play_info_type: 1,
          user_id: window.sessionStorage.getItem('user_id'),
        },
      });
      refPreloadSet.current.add(drama_id);
    }
  };

  const loopData = (data?.response?.loop as IData[]) ?? [];
  const trending = (data?.response?.trending as IData[]) ?? [];
  const release = (data?.response?.new as IData[]) ?? [];
  const recommend = (data?.response?.recommend as IData[]) ?? [];

  return loading ? (
    <div className={styles.loadingWrapper}>
      <Loading />
    </div>
  ) : (
    <div className={styles.GroundContainer}>
      <div className={styles.back} onClick={() => navigate('/')}>
        <IconBack />
      </div>
      {/* 轮播 */}
      <figure className={classNames(styles.carousel)}>
        <Slider {...settings}>
          {loopData.map(item => {
            handlePreload(item.drama_id);
            return (
              <div key={item.drama_id}>
                <div className="carouselItemWrapper" style={{ background: `url(${item.drama_cover_url})` }}>
                  <div
                    className="btn"
                    onClick={() => {
                      navigate(`/dramaDetail?id=${item.drama_id}&device_id=001`);
                    }}
                  >
                    <IconPlay style={{ marginRight: 6 }} />
                    {t('d_play_now')}
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </figure>
      {/* 趋势 */}
      <div className={styles.trendingWrapper}>
        <h1 className={styles.tit}>{t('d_most_trending')} 🔥</h1>
        <div className={styles.trendingContentWrapper}>
          {trending
            .filter((_item, index) => index < 6)
            .map((item, index) => {
              handlePreload(item.drama_id);
              return (
                <div
                  key={item.drama_id}
                  className={styles.trendingItemWrapper}
                  onClick={() => {
                    navigate(`/dramaDetail?id=${item.drama_id}&device_id=001`);
                  }}
                >
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
                      <IconFire />
                      <span className={styles.num}>{renderCount(item.drama_play_times)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* 新发 */}
      <div className={styles.releaseWrapper}>
        <h1 className={styles.tit}>{t('d_new_release')}</h1>
        <figure className={classNames(styles.releaseContentWrapper)}>
          {release.map(item => {
            handlePreload(item.drama_id);
            return (
              <div
                key={item.drama_id}
                className={styles.releaseItemWrapper}
                onClick={() => {
                  navigate(`/dramaDetail?id=${item.drama_id}&device_id=001`);
                }}
              >
                <div className={styles.coverWrapper}>
                  <img src={item.drama_cover_url} />
                  {item.new_release && <div className={styles.newTag}>NEW</div>}
                  <div className={styles.playNum}>
                    <IconPlay />
                    <span>{renderCount(item.drama_play_times)}</span>
                  </div>
                </div>
                <div className={styles.contentWrapper}>
                  <h2>{item.drama_title}</h2>
                </div>
              </div>
            );
          })}
        </figure>
      </div>
      {/* 推荐 */}
      <div className={styles.recommendWrapper}>
        <h1 className={styles.tit}>{t('d_recommended')}</h1>
        <div className={styles.recommendContentWrapper}>
          {recommend
            .filter((_item, index) => index < 6)
            .map(item => {
              handlePreload(item.drama_id);
              return (
                <div
                  key={item.drama_id}
                  className={styles.recommendItemWrapper}
                  onClick={() => {
                    navigate(`/dramaDetail?id=${item.drama_id}&device_id=001`);
                  }}
                >
                  <div className={styles.coverWrapper}>
                    <img src={item.drama_cover_url} />
                    <div className={styles.playNum}>
                      <IconPlay />
                      <span>{renderCount(item.drama_play_times)}</span>
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
export default Ground;
