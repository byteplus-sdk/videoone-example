import React, { useEffect, useRef, useImperativeHandle, useState, useCallback } from 'react';
import style from './index.module.less';
import cn from 'classnames';
import { IComment, IPlayer } from '@/interface';
import IconComment from '@/assets/svgr/iconComment.svg?react';
import CommentComp from '@/components/comment';
import Avatar from '@/assets/images/avatar.png';
import LikeComp, { IRef } from '../like';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import { renderCount } from '@/utils/util';
import translation from '@/utils/translation';
import { debounce } from 'lodash';
import { Popup } from 'antd-mobile';

const Player: React.FC<IPlayer> = React.forwardRef(({ isActive, isTouch, data, index }, ref) => {
  const likeRef = useRef<IRef>(null);
  const [commentVisible, setCommentVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [list, setList] = useState<IComment[]>([]);
  const [{ data: comments, loading }, executeGetComments] = useAxios(
    {
      url: API_PATH.GetVideoComments,
      method: 'GET',
      params: {
        vid: data.vid,
      },
    },
    { manual: true },
  );

  const throttledCalcCaption = useCallback(debounce(calcCaption, 1000), []);

  useImperativeHandle(ref, () => ({
    likeRef,
  }));

  useEffect(() => {
    setList((comments?.response as IComment[]) ?? []);
  }, [comments]);

  useEffect(() => {
    calcCaption();
    window.addEventListener('resize', throttledCalcCaption);
  }, []);

  function calcCaption() {
    try {
      const containerHeight = document.getElementById(`titleContainer${index}`)?.offsetHeight || 0;
      const content = document.getElementById(`title${index}`)?.offsetHeight || 0;

      if (content > containerHeight) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

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
            <LikeComp {...data} ref={likeRef} />
          </div>
          <div
            className={style.comment}
            onClick={e => {
              e.stopPropagation();
              executeGetComments();
              setCommentVisible(true);
            }}
          >
            <IconComment />
            <span>{renderCount(data.comment)}</span>
          </div>
        </div>
      </div>
      <div className={style.bottom}>
        {data.name && <div className={style.name}>@{data.name}</div>}
        <div id={`titleContainer${index}`} className={style.titleContainer}>
          {showMore && (
            <div
              className={style.boxMore}
              onClick={e => {
                e.stopPropagation();
                setMoreVisible(true);
              }}
            >
              {translation('c_more')}
            </div>
          )}
          <div className={style.titleWrapper}>
            <div className={style.title} id={`title${index}`}>
              {data.caption}
            </div>
          </div>
        </div>
      </div>

      {showMore && (
        <Popup
          bodyStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          closeOnMaskClick
          visible={moreVisible}
          maskClassName={style.popupMask}
          onClose={() => {
            setMoreVisible(false);
          }}
        >
          <div className={style.captionTitle}>{data.caption}</div>
        </Popup>
      )}
      <CommentComp
        commentVisible={commentVisible}
        setCommentVisible={setCommentVisible}
        list={list}
        loading={loading}
      />
    </div>
  );
});

export default Player;
