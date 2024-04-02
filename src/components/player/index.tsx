import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import style from './index.module.less';
import cn from 'classnames';
import { IComment, IPlayer } from '@/interface';
import Comment from '@/assets/svgr/comment.svg?react';
import Delete from '@/assets/svgr/delete.svg?react';
import Like from '@/assets/svgr/like.svg?react';
import Avatar from '@/assets/images/avatar.png';
import LikeComp from '../like';
import Popup from '../popup';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
// import Loading from '../loading';
import InputBar from '../input';
import Dialog from '../dialog';
import { formatDateTime } from '@/utils/util';
import translation from '@/utils/translation';

const Player: React.FC<IPlayer> = React.forwardRef(({ isActive, isTouch, data, index }, ref) => {
  const [likeMap, setLikeMap] = useState<Map<number, boolean>>(new Map());
  const likeRef = useRef();
  const [commentVisible, setCommentVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [list, setList] = useState<IComment[]>([]);
  const [{ data: comments }, executeGetComments] = useAxios(
    {
      url: API_PATH.GetVideoComments,
      method: 'GET',
      params: {
        vid: data.vid,
      },
    },
    { manual: true },
  );

  useImperativeHandle(ref, () => ({
    likeRef: likeRef,
  }));

  useEffect(() => {
    setList((comments?.response as IComment[]) ?? []);
  }, [comments]);

  useEffect(() => {
    calcTopComment();
  }, []);

  function renderCount(count: number) {
    const lang = window.navigator.language;
    if (/zh/i.test(lang)) {
      return count > 9999
        ? `${parseFloat(`${count / 10000}`)
            .toFixed(3)
            .slice(0, -2)}万`
        : count;
    }
    return count > 9999
      ? `${parseFloat(`${count / 1000}`)
          .toFixed(3)
          .slice(0, -2)}k`
      : count;
  }

  function calcTopComment() {
    try {
      const containerHeight = document.getElementById(`titleContainer${index}`)?.clientHeight || 0;
      const content = document.getElementById(`title${index}`)?.getBoundingClientRect()?.height || 0;

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
          visible={moreVisible}
          containerClassName={style.popupContainer}
          maskClassName={style.popupMask}
          title="标题"
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
        onClose={() => {
          setCommentVisible(false);
        }}
        title={translation('c_comment_num', list.length ?? 0)}
      >
        {/* {loading && <Loading />} */}
        <div className={style.commentContent}>
          <InputBar
            handleEnter={val => {
              // mock评论添加
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
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
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
      </Popup>
    </div>
  );
});

export default Player;
