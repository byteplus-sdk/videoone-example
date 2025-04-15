// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import IconOutlineLike from '@/assets/svgr/iconOutlineLike.svg?react';
import IconOutlineComment from '@/assets/svgr/iconOutlineComment.svg?react';
import styles from './index.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import { updateDetail } from '@/redux/actions/dramaDetail';
import { useState } from 'react';
import classNames from 'classnames';
import { setCommentPanelVisible } from '@/redux/actions/controls';

const ExpandLeft = () => {
  const dispatch = useDispatch();
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const currentDetail = useSelector((state: RootState) => state.dramaDetail.currentDetail);

  const [isLike, setIsLike] = useState(false);
  return (isFullScreen || isCssFullScreen) && isHorizontal ? (
    <div className={styles.wrapper}>
      <div
        className={classNames(styles.iconWrapper, { [styles.isLike]: isLike })}
        onClick={() => {
          setIsLike(!isLike);
          dispatch(updateDetail({ like: isLike ? currentDetail.like - 1 : currentDetail.like + 1 }));
        }}
      >
        <IconOutlineLike /> {currentDetail?.like}
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          dispatch(setCommentPanelVisible(true));
        }}
      >
        <IconOutlineComment /> {currentDetail?.comment}
      </div>
    </div>
  ) : null;
};

export default ExpandLeft;
