// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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
import type { IDramaDetailListItem } from '@/interface';
import { parseModel } from '@/utils';
import translate from '@/utils/translation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/type';

const Tabs = [
  {
    value: 0,
    title: translate('d_home'),
    renderIcon: (isSelected: boolean) => (isSelected ? <IconHomeSelected /> : <IconHome />),
  },
  {
    value: 1,
    title: translate('d_for_you'),
    renderIcon: (isSelected: boolean) => (isSelected ? <IconVideoSelected /> : <IconVideo />),
  },
];

const DramaGround: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass>();
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);

  const requestConfig = useMemo(
    () => ({
      url: API_PATH.GetDramaFeed,
      method: 'POST' as const,
      data: {
        offset: 0,
        page_size: 5,
        play_info_type: 1,
      },
    }),
    [],
  );

  const [{ data: channelData, loading: channelLoading }] = useAxios(requestConfig);

  const videoDataList = useMemo(
    () =>
      (channelData?.response ?? [])
        .map((item: IDramaDetailListItem) => ({
          ...item,
          video_meta: {
            ...item.video_meta,
            videoModel: parseModel(item.video_meta.video_model!)!,
          },
        }))
        .filter((item: IDramaDetailListItem) => item?.video_meta.videoModel?.PlayInfoList?.[0]?.MainPlayUrl),
    [channelData],
  );

  useEffect(() => {
    document.body.style.background = '#161823';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const onSwiperChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
    if (swiper.activeIndex === 1) {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTabClick = useCallback((tabValue: number) => {
    setActiveIndex(tabValue);
    swiperRef.current?.slideTo(tabValue);
  }, []);

  return (
    <>
      <div className={classNames(styles.content, { [styles.isCssFullScreen]: isCssFullScreen })}>
        <Swiper
          touchStartPreventDefault
          noSwipingSelector="xg-progress,.noSwipingClass"
          onSwiper={swiper => (swiperRef.current = swiper)}
          onActiveIndexChange={onSwiperChange}
          onTransitionEnd={() => setIsSliderMoving(false)}
        >
          <SwiperSlide>
            <Ground />
          </SwiperSlide>
          <SwiperSlide>
            <Channel
              videoDataList={videoDataList}
              loading={channelLoading}
              isChannelActive={activeIndex === 1}
              isChannel
              isSliderMoving={isSliderMoving}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      {!isCssFullScreen && (
        <div className={styles.footer}>
          {Tabs.map(tab => (
            <div className={styles.tab} key={tab.value} onClick={() => handleTabClick(tab.value)}>
              {tab.renderIcon(activeIndex === tab.value)}
              <span>{tab.title}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default DramaGround;
