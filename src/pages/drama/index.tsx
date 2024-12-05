import React, { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import 'swiper/less';
import styles from './index.module.less';
import IconHomeSelected from '@/assets/svgr/iconHomeSelected.svg?react';
import IconVideoSelected from '@/assets/svgr/iconVideoSelected.svg?react';
import IconHome from '@/assets/svgr/iconHome.svg?react';
import IconVideo from '@/assets/svgr/iconVideo.svg?react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';
import Ground from './Ground';
import Channel from './Channel';
import { IVideoDataWithModel } from '@/@types';
import { canSupportPreload, formatPreloadStreamList, parseModel } from '@/utils';
import VePlayer from '@/player';

const Tabs = [
  {
    value: 0,
    title: 'Home',
    renderIcon: (isSelected: boolean) => (isSelected ? <IconHomeSelected /> : <IconHome />),
  },
  {
    value: 1,
    title: 'Channel',
    renderIcon: (isSelected: boolean) => (isSelected ? <IconVideoSelected /> : <IconVideo />),
  },
];

const DramaGround: React.FC = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const preloadOnceRef = useRef<boolean>(false);
  const [isProgressDragging, setProgressDragging] = useState(false);

  const navigate = useNavigate();
  const back = () => navigate('/');

  const [{ data: channelData, loading: channelLoading }] = useAxios({
    url: API_PATH.GetDramaFeed,
    method: 'POST',
    data: {
      offset: 0,
      page_size: 100,
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
      const list: IVideoDataWithModel[] = [];
      channelData?.response.forEach((item: IVideoDataWithModel & { video_model?: string }) => {
        if (!temp.has(item.drama_id) && item.video_model) {
          temp.add(item.drama_id);
          if (parseModel(item.video_model)?.PlayInfoList?.[0]?.MainPlayUrl) {
            list.push({ ...item, videoModel: parseModel(item.video_model)! });
          }
        }
      });
      VePlayer.preloader?.clearPreloadList(); // 切换模式前清空预加载列表
      VePlayer.setPreloadScene(0); // 更新为手动模式，注意：手动模式下直接全量加载所有待预加载资源
      VePlayer.setPreloadList(formatPreloadStreamList(list)); // 设置手动模式待预加载列表
      preloadOnceRef.current = true;
    }
  }, [channelData?.response, channelLoading, activeIndex]);

  return (
    <>
      <div className={styles.content}>
        <Swiper
          touchStartPreventDefault
          noSwiping
          noSwipingClass="no-swipe"
          ref={swiperRef}
          onActiveIndexChange={onSwiperChange}
          onSliderMove={() => setIsSliderMoving(true)}
          allowSlideNext={activeIndex !== 1}
          allowSlidePrev={activeIndex !== 0 && activeIndex === 1 && !isProgressDragging}
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
                videoDataList={(channelData?.response ?? [])
                  .map((item: IVideoDataWithModel & { video_model?: string }) => ({
                    ...item,
                    videoModel: parseModel(item.video_model!),
                  }))
                  .filter((item: IVideoDataWithModel) => item?.videoModel?.PlayInfoList?.[0]?.MainPlayUrl)}
                loading={channelLoading}
                isChannelActive={activeIndex === 1}
                isChannel
                isSliderMoving={isSliderMoving}
                onProgressDrag={() => setProgressDragging(true)}
                onProgressDragend={() => setProgressDragging(false)}
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
                swiperRef.current?.swiper.slideTo(tab.value);
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
