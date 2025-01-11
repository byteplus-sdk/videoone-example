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
import { canSupportPreload, formatPreloadStreamList, parseModel } from '@/utils';
import VePlayer from '@/player';
import { IPreloadStream } from '@byteplus/veplayer';
import t from '@/utils/translation';

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
  const preloadOnceRef = useRef<boolean>(false);

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

  useEffect(() => {
    // PC&Android开启预加载
    if (!channelLoading && channelData?.response && canSupportPreload && !preloadOnceRef.current && activeIndex === 0) {
      const temp = new Set();
      const list: IDramaDetailListItem['video_meta'][] = [];
      channelData?.response.forEach((item: IDramaDetailListItem) => {
        const { drama_meta, video_meta } = item;
        if (!temp.has(drama_meta.drama_id) && video_meta.video_model) {
          temp.add(drama_meta.drama_id);
          if (parseModel(video_meta.video_model)?.PlayInfoList?.[0]?.MainPlayUrl) {
            list.push({ ...item.video_meta, videoModel: parseModel(video_meta.video_model)! });
          }
        }
      });
      VePlayer.preloader?.clearPreloadList(); // 切换模式前清空预加载列表
      VePlayer.setPreloadScene(0); // 更新为手动模式，注意：手动模式下直接全量加载所有待预加载资源
      VePlayer.setPreloadList(formatPreloadStreamList(list) as IPreloadStream[]); // 设置手动模式待预加载列表
      preloadOnceRef.current = true;
    }
  }, [channelData?.response, channelLoading, activeIndex]);

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
      <div className={styles.content}>
        <Swiper
          touchStartPreventDefault
          noSwiping
          noSwipingSelector="xg-progress"
          noSwipingClass="no-swipe"
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
    </>
  );
};
export default DramaGround;
