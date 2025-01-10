import React, { PropsWithChildren, useMemo } from 'react';
import { Viewer } from '@volcengine/imagex-react';

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

const SliderItem: React.FC<ISliderItemProps> = ({
  activeIndex,
  data,
  index,
  isFullScreen,
  isLandScapeMode,
  otherComponent,
  children,
}) => {
  const coverUrl = data?.videoModel?.PosterUrl ?? data?.cover_url;

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
