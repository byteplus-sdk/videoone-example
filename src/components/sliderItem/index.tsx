// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React, { PropsWithChildren, useMemo } from 'react';
import type { IDramaDetailListItem } from '@/interface';
import styles from './index.module.less';
import classNames from 'classnames';
import { imgUrl, os } from '@/utils';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import Image from '../Image';
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
      className={classNames(styles.wrapper, {
        [styles.isChannel]: isChannel,
        [styles.isPortrait]: isPortrait,
        [styles.isFullScreen]: isFullScreen && !isCssFullScreen,
        [styles.isCssFullScreen]: isCssFullScreen,
        [styles.isIOS]: os.isIos,
      })}
    >
      {shouldRenderContent && (
        <>
          <div className={styles.poster}>
            <Image src={imgUrl(coverUrl)} alt={data.name} />
          </div>
          <div id={`swiper-video-container-${index}`} className={styles.videoContainer} onClick={clickCallback}>
            <div className="veplayer-cus-gradient-wrapper" />
            <div className={styles.videoWithRotateBtn} id={`video-with-rotate-btn-${index}`}>
              {children}
            </div>
          </div>
          {data.vip && isCssFullScreen && (
            <div
              className={styles.back}
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
