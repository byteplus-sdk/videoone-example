// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useImperativeHandle, useCallback } from 'react';
import { useLottie } from 'lottie-react';
import likeAni from '@/assets/lottie/like.json';
import unlikeAni from '@/assets/lottie/unLike.json';
import IconUnLike from '@/assets/svgr/iconUnLike.svg?react';
import styles from './index.module.less';

export interface IRef {
  handleLike: () => void;
}

interface IProps {
  like: number;
}

const Like = React.forwardRef<IRef, IProps>((props, ref) => {
  const [isLike, setLike] = useState(false);
  const [hide, setHide] = useState(false);

  const { View: like, goToAndPlay: likePlay } = useLottie({
    animationData: likeAni,
    autoPlay: false,
    loop: false,
    onComplete: () => {
      !hide && setHide(true);
    },
  });

  const handleLike = useCallback(() => {
    setLike(!isLike);
    if (isLike) {
      unlikePlay(0, true);
    } else {
      likePlay(0, true);
    }
  }, [isLike]);

  useImperativeHandle(ref, () => ({
    handleLike,
  }));

  const { View: unLike, goToAndPlay: unlikePlay } = useLottie({
    animationData: unlikeAni,
    autoPlay: false,
    loop: false,
    onComplete: () => {
      !hide && setHide(true);
    },
  });

  return (
    <>
      <div
        className={styles.like}
        onClick={e => {
          e.stopPropagation();
          handleLike();
        }}
      >
        <div className={styles.ani} style={{ display: isLike ? 'block' : 'none' }}>
          {like}
        </div>
        <div className={styles.ani} style={{ display: isLike ? 'none' : 'block' }}>
          {unLike}
        </div>
        {!hide && (
          <div className={styles.staticSvg}>
            <IconUnLike />
          </div>
        )}
      </div>
      <span>{isLike ? props.like + 1 : props.like}</span>
    </>
  );
});

export default Like;
