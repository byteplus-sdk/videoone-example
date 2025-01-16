import React, { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import 'swiper/less';
import styles from './index.module.less';
import IconHomeSelected from '@/assets/svgr/iconHomeSelected.svg?react';
import IconVideoSelected from '@/assets/svgr/iconVideoSelected.svg?react';
import IconHome from '@/assets/svgr/iconHome.svg?react';
import IconVideo from '@/assets/svgr/iconVideo.svg?react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import Ground from './Ground';
import Channel from './Channel';
import { IDramaDetailListItem } from '@/@types';
import { parseModel } from '@/utils';
import t from '@/utils/translation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/type';

const Tabs = [
  {
    value: 0,
    title: t('d_home'),
    renderIcon: (isSelected: boolean) => (isSelected ? <IconHomeSelected /> : <IconHome />),
  },
  {
    value: 1,
    title: t('d_for_you'),
    renderIcon: (isSelected: boolean) => (isSelected ? <IconVideoSelected /> : <IconVideo />),
  },
];

const DramaGround: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass>();
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const [{ data: channelData, loading: channelLoading }] = useAxios({
    url: API_PATH.GetDramaFeed,
    method: 'POST',
    data: {
      offset: 0,
      page_size: 5,
      play_info_type: 1,
    },
  });

  useEffect(() => {
    document.body.style.background = '#161823';
  }, []);

  const onSwiperChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
    if (swiper.activeIndex === 1) {
      window.scrollTo({ left: 0, top: 0 });
    }
  }, []);

  const videoDataList = (channelData?.response ?? [])
    .map((item: IDramaDetailListItem) => ({
      ...item,
      video_meta: {
        ...item.video_meta,
        videoModel: parseModel(item.video_meta.video_model!)!,
      },
    }))
    .filter((item: IDramaDetailListItem) => item?.video_meta.videoModel?.PlayInfoList?.[0]?.MainPlayUrl);

  return (
    <>
      <div className={classNames(styles.content, { [styles.isCssFullScreen]: isCssFullScreen })}>
        <Swiper
          touchStartPreventDefault
          noSwipingSelector="xg-progress,.noSwipingClass"
          onSwiper={swiper => (swiperRef.current = swiper)}
          onActiveIndexChange={onSwiperChange}
          onTransitionEnd={() => {
            setIsSliderMoving(false);
          }}
        >
          <SwiperSlide>
            <div className={styles.ground}>
              <Ground />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.channel} id="channel">
              <Channel
                videoDataList={videoDataList}
                loading={channelLoading}
                isChannelActive={activeIndex === 1}
                isChannel
                isSliderMoving={isSliderMoving}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      {isCssFullScreen ? null : (
        <div className={styles.footer}>
          {Tabs.map(tab => {
            return (
              <div
                className={classNames(styles.tab)}
                key={tab.value}
                onClick={() => {
                  setActiveIndex(tab.value);
                  swiperRef.current?.slideTo(tab.value);
                }}
              >
                {tab.renderIcon(activeIndex === tab.value)}
                <span>{tab.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default DramaGround;
