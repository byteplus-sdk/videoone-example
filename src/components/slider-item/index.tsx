import React, { PropsWithChildren, useState, MouseEvent, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Viewer } from '@volcengine/imagex-react';
// import LikeIcon from '@/assets/svg/like.svg?react';
// import LikeActiveIcon from '@/assets/svg/like-active.svg?react';
// import FavIcon from '@/assets/svg/fav.svg?react';
// import FavActiveIcon from '@/assets/svg/fav-active.svg?react';
// import DIcon from '@/assets/svg/d.svg?react';

import { IDramaDetailListItem } from '@/@types';

import style from './index.module.less';
import classNames from 'classnames';

interface ISliderItemProps extends PropsWithChildren {
  isActive: boolean;
  activeIndex: number;
  data: IDramaDetailListItem['video_meta'];
  index: number;
  isChannel?: boolean;
  isLandScapeMode?: boolean;
  isFullScreen?: boolean;
  otherComponent: React.ReactNode;
  getCurrentTime: () => number;
  playNextStatus: string;
}

const imageSizes = [600, 750, 800, 960];

const mockFavLikeData = () => (Math.random() * 50 + 50).toFixed(1);

const SliderItem: React.FC<ISliderItemProps> = ({
  activeIndex,
  data,
  index,
  isChannel,
  getCurrentTime,
  isFullScreen,
  isLandScapeMode,
  otherComponent,
  children,
}) => {
  const coverUrl = data?.videoModel?.PosterUrl ?? data?.cover_url;
  const [isLike, setIsLike] = useState<boolean>(false);
  const [isFav, setIsFav] = useState<boolean>(false);

  const navigate = useNavigate();
  const favNumRef = useRef('0');
  const likeNumRef = useRef('0');

  useEffect(() => {
    favNumRef.current = mockFavLikeData();
    likeNumRef.current = mockFavLikeData();
  }, []);

  const favNum = mockFavLikeData();
  const likeNum = mockFavLikeData();

  // const onBottomBtnClick = useCallback(
  //   (e: MouseEvent) => {
  //     e.stopPropagation();
  //     const dramaId = data?.episodeDetail?.dramaInfo?.dramaId;
  //     const startTime = getCurrentTime();
  //     if (dramaId) {
  //       navigate(`/playlet/theater/?id=${dramaId}&startTime=${startTime}`);
  //     }
  //   },
  //   [data?.episodeDetail?.dramaInfo?.dramaId, getCurrentTime, navigate],
  // );

  // 距离当前两集加载，减少dom数目
  const shouldRenderContent = useMemo(() => Math.abs(activeIndex - index) <= 2, [activeIndex, index]);

  return (
    <div className={style.wrapper}>
      {shouldRenderContent && (
        <>
          <div className={classNames(style.poster, { [style.isLandScapeMode]: isLandScapeMode })}>
            <Viewer
              layout="raw"
              placeholder="skeleton"
              objectFit="cover"
              objectPosition="center"
              loading="eager"
              src={coverUrl}
              imageSizes={imageSizes}
              loader={({ src, format, width }) => {
                return `//mpaas-vod-cover-test.byte-test.com/${src}~${'tplv-vod-noop'}:${width}:q75.${format}`;
              }}
            />
          </div>
          <div id={`swiper-video-container-${index}`} className={style.videoContainer}>
            <div className="veplayer-cus-gradient-wrapper" />
            <div
              className={classNames(style.videoWithRotateBtn, {
                [style.isLandScapeMode]: isLandScapeMode,
                [style.isFullScreen]: isFullScreen,
              })}
              id={`videoWithRotateBtn${index}`}
            >
              {children}
            </div>
          </div>
          {otherComponent}
        </>
      )}
    </div>
  );
};

export default SliderItem;
