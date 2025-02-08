import React, { useState, useImperativeHandle } from 'react';
import { useLottie } from 'lottie-react';
import likeAni from '@/assets/lottie/like.json';
import unlikeAni from '@/assets/lottie/unLike.json';
import IconUnLike from '@/assets/svgr/iconUnLike.svg?react';
import style from './index.module.less';

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

  const handleLike = () => {
    setLike(!isLike);
    if (isLike) {
      unlikePlay(0, true);
    } else {
      likePlay(0, true);
    }
  };

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
        className={style.like}
        onClick={e => {
          e.stopPropagation();
          handleLike();
        }}
      >
        <div className={style.ani} style={{ display: isLike ? 'block' : 'none' }}>
          {like}
        </div>
        <div className={style.ani} style={{ display: isLike ? 'none' : 'block' }}>
          {unLike}
        </div>
        {!hide && (
          <div className={style.staticSvg}>
            <IconUnLike />
          </div>
        )}
      </div>
      <span>{isLike ? props.like + 1 : props.like}</span>
    </>
  );
});

export default Like;
