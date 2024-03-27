import React, { useEffect, useState } from 'react';
import style from './index.module.less';
import cn from 'classnames';
import { IComment, IPlayer } from '@/interface';
import Comment from '@/assets/svgr/comment.svg?react';
import Close from '@/assets/svgr/close.svg?react';
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

const Player: React.FC<IPlayer> = ({ isActive, isTouch, data }) => {
  const [likeMap, setLikeMap] = useState<Map<number, boolean>>(new Map());
  const [commentVisible, setCommentVisible] = useState(false);
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

  useEffect(() => {
    setList((comments?.response as IComment[]) ?? []);
  }, [comments]);

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    setCommentVisible(false);
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
            <LikeComp {...data} />
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
            <span>{data.comment}</span>
          </div>
        </div>
      </div>
      <div className={style.bottom}>
        {data.name && <div className={style.name}>@{data.name}</div>}
        <div className={style.title}>{data.caption}</div>
      </div>
      <Popup
        visible={commentVisible}
        onMaskClick={handleClose}
        contentClassName={style.popupBody}
        maskClassName={style.popupMask}
      >
        {/* {loading && <Loading />} */}
        <div>
          <div className={style.header}>
            <span></span>
            <div className={style.commentNum}>{translation('c_comment_num', list.length ?? 0)}</div>
            <span className={style.close} onClick={handleClose}>
              <Close />
            </span>
          </div>
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
        </div>
      </Popup>
    </div>
  );
};

export default Player;
