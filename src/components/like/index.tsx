import React, { useState } from 'react';
import { useLottie } from 'lottie-react';
import likeAni from '@/assets/lottie/like.json';
import unlikeAni from '@/assets/lottie/unLike.json';
import style from './index.module.less';
import { IVideo } from '@/interface';

const Like: React.FC<IVideo> = props => {
  const [isLike, setLike] = useState(false);
  const { View: like, goToAndPlay: likePlay } = useLottie({
    animationData: likeAni,
    autoPlay: false,
    loop: false,
  });

  const { View: unLike, goToAndPlay: unlikePlay } = useLottie({
    animationData: unlikeAni,
    autoPlay: false,
    loop: false,
  });

  return (
    <>
      <div
        className={style.like}
        onClick={e => {
          e.stopPropagation();
          setLike(!isLike);
          if (isLike) {
            unlikePlay(0, true);
          } else {
            likePlay(0, true);
          }
        }}
      >
        <div style={{ display: isLike ? 'block' : 'none' }}>{like}</div>
        <div style={{ display: isLike ? 'none' : 'block' }}>{unLike}</div>
      </div>
      <span>{isLike ? props.like + 1 : props.like}</span>
    </>
  );
};

export default Like;
