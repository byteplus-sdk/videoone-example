import React, { useEffect, useRef, useImperativeHandle, useState, useCallback } from 'react';
import style from './index.module.less';
import cn from 'classnames';
import { IComment, IPlayer } from '@/interface';
import Comment from '@/assets/svgr/comment.svg?react';
import Delete from '@/assets/svgr/delete.svg?react';
import Like from '@/assets/svgr/like.svg?react';
import Avatar from '@/assets/images/avatar.png';
import LikeComp from '../like';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import IconClose from '@/assets/svgr/close.svg?react';
import InputBar from '../input';
import Dialog from '../dialog';
import { formatDateTime, renderCount } from '@/utils/util';
import translation from '@/utils/translation';
import Loading from '../loading';
import { debounce } from 'lodash';
import { Popup } from 'antd-mobile';

const Player: React.FC<IPlayer> = React.forwardRef(({ isActive, isTouch, data, index }, ref) => {
  const [likeMap, setLikeMap] = useState<Map<number, boolean>>(new Map());
  const likeRef = useRef();
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
            <Comment />
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

      <Popup
        visible={commentVisible}
        maskClassName={style.popupMask}
        closeOnMaskClick
        bodyStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        onClose={() => {
          setCommentVisible(false);
        }}
      >
        <div>
          <div className={style.header}>
            <div className={style.title}>{translation('c_comment_num', list.length ?? 0)}</div>
            <div
              className={style.close}
              onClick={() => {
                setCommentVisible(false);
              }}
            >
              <IconClose />
            </div>
          </div>
          {loading ? (
            <div className={style.loading}>
              <Loading />
            </div>
          ) : (
            <div className={style.commentContent}>
              <InputBar
                handleEnter={val => {
                  // mock comments
                  setList([
                    {
                      content: val,
                      name: 'xshellv',
                      uid: new Date().valueOf(),
                      like: 0,
                      createTime: new Date(),
                    },
                    ...list,
                  ]);
                }}
              />
              {list.map(comment => {
                return (
                  <div className={style.comment} key={comment.uid}>
                    <div className={style.avatar}>
                      <div>
                        <img src={Avatar} alt="" />
                      </div>
                    </div>
                    <div className={style.contentWrapper}>
                      <div className={style.name}>{comment.name}</div>
                      <div className={style.content}>{comment.content}</div>
                      <div className={style.operation}>
                        <div className={style.time}>{formatDateTime(new Date(comment.createTime))}</div>
                        <div
                          className={style.del}
                          onClick={() => {
                            Dialog.confirm({
                              title: translation('c_delete_confirm'),
                              content: translation('c_content_confirm'),
                              onCancel: () => {
                                console.log('cancel');
                              },
                              onConfirm: () => {
                                setList(list.filter(item => item.uid !== comment.uid));
                              },
                            });
                          }}
                        >
                          <Delete />
                          &nbsp;
                          <span>{translation('c_comment_del')}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(style.like, { [style.unLike]: !likeMap.get(comment.uid) })}
                      onClick={() => {
                        likeMap.set(comment.uid, !likeMap.get(comment.uid));
                        setLikeMap(new Map(likeMap));
                      }}
                    >
                      <Like />
                      {likeMap.get(comment.uid) ? comment.like + 1 : comment.like}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
});

export default Player;
