import React from 'react';
import style from './index.module.less';
import cn from 'classnames';
import { IPlayer } from '@/interface';
import Comment from '@/assets/svgr/comment.svg?react';
import Avatar from '@/assets/images/avatar.png';
import Like from '../like';

const Player: React.FC<IPlayer> = ({ isActive, isTouch, data }) => {
  return (
    <div className={cn(style.wrapper, style.swiperItem)}>
      <img src={data.coverUrl} className={isActive && !isTouch ? style.posterHide : style.posterShow} />
      <div className={style.rightSlider}>
        <div className={style.btns}>
          <div className={style.avatar}>
            <div>
              <img src={Avatar} alt="" />
            </div>
          </div>
          <div className={style.like}>
            <Like {...data} />
          </div>
          <div className={style.comment}>
            <Comment />
            <span>{data.comment}</span>
          </div>
        </div>
      </div>
      <div className={style.bottom}>
        {data.name && <div className={style.name}>@{data.name}</div>}
        <div className={style.title}>{data.caption}</div>
      </div>
    </div>
  );
};

export default Player;
