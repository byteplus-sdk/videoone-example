import React, { useEffect, useRef } from 'react';
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
import { formatPreloadStreamList, os, parseModel } from '@/utils';
import VePlayer, { IPreloadStream } from '@byteplus/veplayer';

interface IData {
  drama_cover_url: string;
  drama_id: string;
  drama_play_times: number;
  drama_title: string;
  new_release: boolean;
}

// 抽取公共类型定义
interface DramaItemProps extends IData {
  index?: number;
  showTopTag?: boolean;
}

// 抽取可复用的卡片组件
const DramaCard: React.FC<DramaItemProps & { type: 'trending' | 'release' | 'recommend' }> = ({
  drama_id,
  drama_cover_url,
  drama_title,
  drama_play_times,
  new_release,
  index,
  type,
  showTopTag,
}) => {
  const navigate = useNavigate();

  return (
    <div
      drama-id={drama_id}
      className={classNames(styles[`${type}ItemWrapper`], 'drama')}
      onClick={() => navigate(`/dramaDetail?id=${drama_id}&device_id=001`)}
    >
      <div className={styles.coverWrapper}>
        <img src={drama_cover_url} alt={drama_title} />
        {showTopTag &&
          index !== undefined &&
          (index < 3 ? (
            <span className={styles.tagTop}>TOP{index + 1}</span>
          ) : (
            <span className={styles.tagNum}>{index + 1}</span>
          ))}
        {type === 'release' && new_release && <div className={styles.newTag}>NEW</div>}
        <div className={styles.playNum}>
          <IconPlay />
          <span>{renderCount(drama_play_times)}</span>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <h2>{drama_title}</h2>
        {type === 'trending' && (
          <div className={styles.popularity}>
            <IconFire />
            <span className={styles.num}>{renderCount(drama_play_times)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const settings: Settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  slidesToShow: 1,
  autoplaySpeed: 5000,
  pauseOnFocus: false,
  pauseOnHover: false,
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
  const refIo = useRef<IntersectionObserver>();
  const preloadOnceRef = useRef<boolean>(false);

  const [{ data, loading }] = useAxios({
    url: API_PATH.GetDramaChannel,
    method: 'POST',
  });

  const [{ data: dramaDetailData }, executePreload] = useAxios(
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

  useEffect(() => {
    refIo.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0 && entry.target.getAttribute('drama-id')) {
          handlePreload(entry.target.getAttribute('drama-id')!);
        }
      });
    });
    const dramaLIst = document.querySelectorAll('.drama');
    dramaLIst.forEach(el => {
      refIo.current?.observe(el);
    });
  }, [data?.response]);

  useEffect(() => {
    return () => {
      refIo.current?.disconnect();
    };
  }, []);

  // 抽取预加载逻辑
  const setupPreload = () => {
    if (!(os.isPc || os.isAndroid) || !dramaDetailData?.response) return;

    const singlelist = [
      {
        ...dramaDetailData.response[0],
        videoModel: parseModel(dramaDetailData.response[0].video_model)!,
      },
    ];

    if (!preloadOnceRef.current) {
      preloadOnceRef.current = true;
      VePlayer.setPreloadScene(0);
      VePlayer.preloader?.clearPreloadList();
      VePlayer.setPreloadList(formatPreloadStreamList(singlelist) as IPreloadStream[]);
    } else {
      VePlayer.addPreloadList(formatPreloadStreamList(singlelist) as IPreloadStream[]);
    }
  };

  useEffect(() => {
    setupPreload();
  }, [dramaDetailData?.response]);

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
      <div className={classNames(styles.carousel, 'noSwipingClass')}>
        <Slider {...settings}>
          {loopData.map(item => {
            return (
              <div key={item.drama_id} className="drama" drama-id={item.drama_id}>
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
      </div>
      {/* 趋势 */}
      <div className={styles.trendingWrapper}>
        <h1 className={styles.tit}>{t('d_most_trending')} 🔥</h1>
        <div className={styles.trendingContentWrapper}>
          {trending
            .filter((_item, index) => index < 6)
            .map((item, index) => (
              <DramaCard key={item.drama_id} {...item} type="trending" index={index} showTopTag />
            ))}
        </div>
      </div>
      {/* 新发 */}
      <div className={styles.releaseWrapper}>
        <h1 className={styles.tit}>{t('d_new_release')}</h1>
        <div className={classNames(styles.releaseContentWrapper, 'noSwipingClass')}>
          {release.map(item => (
            <DramaCard key={item.drama_id} {...item} type="release" />
          ))}
        </div>
      </div>
      {/* 推荐 */}
      <div className={styles.recommendWrapper}>
        <h1 className={styles.tit}>{t('d_recommended')}</h1>
        <div className={styles.recommendContentWrapper}>
          {recommend
            .filter((_item, index) => index < 6)
            .map(item => (
              <DramaCard key={item.drama_id} {...item} type="recommend" />
            ))}
        </div>
      </div>
    </div>
  );
};
export default Ground;
