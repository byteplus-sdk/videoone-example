// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useImperativeHandle, useState, useCallback } from 'react';
import styles from './index.module.less';
import classNames from 'classnames';
import { IComment, IPlayer } from '@/interface';
import IconComment from '@/assets/svgr/iconComment.svg?react';
import Comment from '@/components/comment';
import Like, { IRef } from '../like';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';
import { renderCount } from '@/utils/util';
import translate from '@/utils/translation';
import { debounce } from 'lodash-es';
import { Popup } from 'antd-mobile';
import { imgUrl } from '@/utils';
import Image from '../Image';

const Player: React.FC<IPlayer> = React.forwardRef(({ data, index }, ref) => {
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

    return () => {
      window.removeEventListener('resize', throttledCalcCaption);
    };
  }, []);

  function calcCaption() {
    try {
      const containerHeight = document.getElementById(`title-container-${index}`)?.offsetHeight || 0;
      const content = document.getElementById(`title-${index}`)?.offsetHeight || 0;

      setShowMore(content > containerHeight);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={classNames(styles.wrapper, styles.swiperItem)}>
      <Image src={data.coverUrl} className={styles.posterShow} />
      {index === 0 ? (
        <div className={styles.veplayerWrapper}>
          <div id="veplayer-container" />
        </div>
      ) : (
        <div className={styles.videoDom} id={`swiper-video-container-${index}`}></div>
      )}

      <div className={styles.rightSlider}>
        <div className={styles.btns}>
          <div className={styles.avatar}>
            <Image
              src={imgUrl(
                '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/f91bdb13eb83960457760d4f0be0b1e8.png~tplv-j963mrpdmh-image.image',
              )}
              alt="avatar"
              className={styles.img}
            />
          </div>
          <div className={styles.like}>
            <Like {...data} ref={likeRef} />
          </div>
          <div
            className={styles.comment}
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
      <div className={styles.bottom}>
        {data.name && <div className={styles.name}>@{data.name}</div>}
        <div id={`title-container-${index}`} className={styles.titleContainer}>
          {showMore && (
            <div
              className={styles.boxMore}
              onClick={e => {
                e.stopPropagation();
                setMoreVisible(true);
              }}
            >
              {translate('c_more')}
            </div>
          )}
          <div className={styles.titleWrapper}>
            <div className={styles.title} id={`title-${index}`}>
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
          maskClassName={styles.popupMask}
          onClose={() => {
            setMoreVisible(false);
          }}
        >
          <div className={styles.captionTitle}>{data.caption}</div>
        </Popup>
      )}
      <Comment commentVisible={commentVisible} setCommentVisible={setCommentVisible} list={list} loading={loading} />
    </div>
  );
});

export default Player;
