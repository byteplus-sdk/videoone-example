import { Dialog, Popup } from 'antd-mobile';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.less';
import translate from '@/utils/translation';
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
import useMountContainer from '@/hooks/useMountContainer';
import Image from '../Image';
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
  loading,
}) => {
  const [likeMap, setLikeMap] = useState<Map<number, boolean>>(new Map());
  const [list, setList] = useState<IComment[]>(propList ?? []);
  const { getMountContainer } = useMountContainer();

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
        like: Math.floor(Math.random() * 10) + 1,
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
      getContainer={getMountContainer()}
      bodyClassName={classNames(styles.popupLockBodyClass, {
        [styles.isFullScreen]: (isFullScreen || isCssFullScreen) && isHorizontal,
      })}
    >
      <div>
        <div className={styles.header}>
          <div className={styles.title}>{translate('c_comment_num', list.length ?? 0)}</div>
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
                  <CommentItem
                    key={comment.uid}
                    comment={comment}
                    clickDelete={() => {
                      Dialog.confirm({
                        title: translate('c_delete_confirm'),
                        getContainer: getMountContainer(),
                        bodyClassName: classNames(styles.confirmBody, {
                          [styles.isFullScreen]: isFullScreen,
                        }),
                        content: translate('c_content_confirm'),
                        cancelText: <span style={{ color: '#161823bf' }}>{translate('c_cancel')}</span>,
                        confirmText: <span style={{ color: '#161823bf' }}>{translate('c_confirm')}</span>,
                        onConfirm: () => {
                          setList(list.filter(item => item.uid !== comment.uid));
                        },
                      });
                    }}
                    clickLike={() => {
                      likeMap.set(comment.uid, !likeMap.get(comment.uid));
                      setLikeMap(new Map(likeMap));
                    }}
                    isLike={likeMap.get(comment.uid)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};

const CommentItem = ({
  comment,
  clickDelete,
  clickLike,
  isLike,
}: {
  comment: IComment;
  clickDelete: () => void;
  clickLike: () => void;
  isLike?: boolean;
}) => {
  return (
    <div className={styles.comment} key={comment.uid}>
      <div className={styles.avatar}>
        <Image
          alt="avatar"
          src={imgUrl(
            '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/f91bdb13eb83960457760d4f0be0b1e8.png~tplv-j963mrpdmh-image.image',
          )}
        />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.name}>{comment.name}</div>
        <div className={styles.content}>{comment.content}</div>
        <div className={styles.operation}>
          <div className={styles.time}>{formatDateTime(new Date(comment.createTime))}</div>
          <div className={styles.del} onClick={clickDelete}>
            <Delete />
            &nbsp;
            <span>{translate('c_comment_del')}</span>
          </div>
        </div>
      </div>
      <div className={cn(styles.like, { [styles.unLike]: !isLike })} onClick={clickLike}>
        <Like />
        {isLike ? comment.like + 1 : comment.like}
      </div>
    </div>
  );
};
export default Comment;
