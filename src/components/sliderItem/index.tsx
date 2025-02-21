import React, { PropsWithChildren, useMemo } from 'react';
import { IDramaDetailListItem } from '@/@types';
import style from './index.module.less';
import classNames from 'classnames';
import { imgUrl, os } from '@/utils';
import IconBack from '@/assets/svgr/iconBack.svg?react';
interface ISliderItemProps extends PropsWithChildren {
  isActive: boolean;
  activeIndex: number;
  data: IDramaDetailListItem['video_meta'];
  index: number;
  isChannel?: boolean;
  isPortrait?: boolean;
  isFullScreen?: boolean;
  isCssFullScreen?: boolean;
  otherComponent: React.ReactNode;
  getCurrentTime: () => number;
  clickCallback: () => void;
  playNextStatus: string;
  goBack: () => void;
}

const SliderItem: React.FC<ISliderItemProps> = ({
  activeIndex,
  data,
  isChannel,
  index,
  isFullScreen,
  isPortrait,
  otherComponent,
  children,
  clickCallback,
  isCssFullScreen,
  goBack,
}) => {
  const coverUrl = data?.videoModel?.PosterUrl ?? data?.cover_url;

  // Load two episodes from the current episode to reduce the number of DOMs
  const shouldRenderContent = useMemo(() => Math.abs(activeIndex - index) <= 2, [activeIndex, index]);

  return (
    <div
      className={classNames(style.wrapper, {
        [style.isChannel]: isChannel,
        [style.isPortrait]: isPortrait,
        [style.isFullScreen]: isFullScreen && !isCssFullScreen,
        [style.isCssFullScreen]: isCssFullScreen,
        [style.isIOS]: os.isIos,
      })}
    >
      {shouldRenderContent && (
        <>
          <div className={style.poster}>
            <img src={imgUrl(coverUrl)} alt="" />
          </div>
          <div id={`swiper-video-container-${index}`} className={style.videoContainer} onClick={clickCallback}>
            <div className="veplayer-cus-gradient-wrapper" />
            <div className={style.videoWithRotateBtn} id={`video-with-rotate-btn-${index}`}>
              {children}
            </div>
          </div>
          {data.vip && isCssFullScreen && (
            <div
              className={style.back}
              onClick={e => {
                e.stopPropagation();
                goBack();
              }}
            >
              <IconBack />
            </div>
          )}
          {otherComponent}
        </>
      )}
    </div>
  );
};

export default SliderItem;
