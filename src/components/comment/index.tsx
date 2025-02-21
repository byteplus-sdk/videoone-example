import { Dialog, Popup } from 'antd-mobile';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.less';
import translation from '@/utils/translation';
import IconClose from '@/assets/svgr/iconClose.svg?react';
import Loading from '../loading';
import InputBar from '../input';
import { formatDateTime } from '@/utils/util';
import Delete from '@/assets/svgr/iconDelete.svg?react';
import Like from '@/assets/svgr/iconLike.svg?react';
import cn from 'classnames';
import { IComment } from '@/interface';
import classNames from 'classnames';
import { imgUrl } from '@/utils';

interface IProps {
  list: IComment[];
  loading: boolean;
  isFullScreen?: boolean;
  isPortrait?: boolean;
  isCssFullScreen?: boolean;
  isHorizontal?: boolean;
  commentVisible: boolean;
  setCommentVisible: (value: boolean) => void;
}

const Comment: React.FC<IProps> = ({
  list: propList,
  commentVisible,
  setCommentVisible,
  isCssFullScreen,
  isHorizontal,
  isFullScreen,
  isPortrait,
  loading,
}) => {
  const [likeMap, setLikeMap] = useState<Map<number, boolean>>(new Map());
  const [list, setList] = useState<IComment[]>(propList ?? []);

  useEffect(() => {
    if (propList?.length > 0) {
      setList(propList);
    }
  }, [propList]);

  const handleAddComment = useCallback((val: string) => {
    // mock comments
    setList(prevList => [
      {
        content: val,
        name: 'xshellv',
        uid: new Date().valueOf(),
        like: 10,
        createTime: new Date(),
      },
      ...prevList,
    ]);
  }, []);

  return (
    <Popup
      visible={commentVisible}
      closeOnMaskClick
      bodyStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      onClose={() => {
        setCommentVisible(false);
      }}
      position={(isFullScreen || isCssFullScreen) && isHorizontal ? 'right' : 'bottom'}
      getContainer={!isPortrait && isFullScreen && !isCssFullScreen ? window.playerSdk?.player?.root : document.body}
      bodyClassName={classNames(styles.popupLockBodyClass, {
        [styles.isFullScreen]: (isFullScreen || isCssFullScreen) && isHorizontal,
      })}
    >
      <div>
        <div className={styles.header}>
          <div className={styles.title}>{translation('c_comment_num', list.length ?? 0)}</div>
          <div
            className={styles.close}
            onClick={() => {
              setCommentVisible(false);
            }}
          >
            <IconClose />
          </div>
        </div>
        <div className={cn(styles.body, { [styles.isLoading]: loading })}>
          {loading ? (
            <div className={styles.loading}>
              <Loading />
            </div>
          ) : (
            <div className={styles.commentContent}>
              <InputBar
                handleEnter={val => {
                  handleAddComment(val);
                }}
              />
              {list.map(comment => {
                return (
                  <div className={styles.comment} key={comment.uid}>
                    <div className={styles.avatar}>
                      <div>
                        <img
                          src={imgUrl(
                            imgUrl(
                              '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/f91bdb13eb83960457760d4f0be0b1e8.png~tplv-j963mrpdmh-image.image',
                            ),
                          )}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className={styles.contentWrapper}>
                      <div className={styles.name}>{comment.name}</div>
                      <div className={styles.content}>{comment.content}</div>
                      <div className={styles.operation}>
                        <div className={styles.time}>{formatDateTime(new Date(comment.createTime))}</div>
                        <div
                          className={styles.del}
                          onClick={() => {
                            Dialog.confirm({
                              title: translation('c_delete_confirm'),
                              getContainer:
                                !isPortrait && isFullScreen && !isCssFullScreen
                                  ? window.playerSdk?.player?.root
                                  : document.body,
                              bodyClassName: classNames(styles.confirmBody, {
                                [styles.isFullScreen]: isFullScreen,
                              }),
                              content: translation('c_content_confirm'),
                              cancelText: <span style={{ color: '#161823bf' }}>{translation('c_cancel')}</span>,
                              confirmText: <span style={{ color: '#161823bf' }}>{translation('c_confirm')}</span>,
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
                      className={cn(styles.like, { [styles.unLike]: !likeMap.get(comment.uid) })}
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
      </div>
    </Popup>
  );
};

export default Comment;
