import { Dialog, Popup } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import translation from '@/utils/translation';
import IconClose from '@/assets/svgr/iconClose.svg?react';
import Loading from '../loading';
import InputBar from '../input';
import Avatar from '@/assets/images/avatar.png';
import { formatDateTime } from '@/utils/util';
import Delete from '@/assets/svgr/iconDelete.svg?react';
import Like from '@/assets/svgr/iconLike.svg?react';
import cn from 'classnames';
import { IComment } from '@/interface';

interface IProps {
  list: IComment[];
  loading: boolean;
  commentVisible: boolean;
  setCommentVisible: (value: boolean) => void;
}

const Comment: React.FC<IProps> = props => {
  const [likeMap, setLikeMap] = useState<Map<number, boolean>>(new Map());
  const [list, setList] = useState<IComment[]>(props.list ?? []);

  useEffect(() => {
    if (props.list?.length > 0) {
      setList(props.list);
    }
  }, [props.list?.length]);

  return (
    <Popup
      visible={props.commentVisible}
      closeOnMaskClick
      bodyStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      onClose={() => {
        props.setCommentVisible(false);
      }}
    >
      <div>
        <div className={styles.header}>
          <div className={styles.title}>{translation('c_comment_num', list.length ?? 0)}</div>
          <div
            className={styles.close}
            onClick={() => {
              props.setCommentVisible(false);
            }}
          >
            <IconClose />
          </div>
        </div>
        <div className={cn(styles.body, { [styles.isLoading]: props.loading })}>
          {props.loading ? (
            <div className={styles.loading}>
              <Loading />
            </div>
          ) : (
            <div className={styles.commentContent}>
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
                  <div className={styles.comment} key={comment.uid}>
                    <div className={styles.avatar}>
                      <div>
                        <img src={Avatar} alt="" />
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
