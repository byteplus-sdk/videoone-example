// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import classNames from 'classnames';
import React from 'react';
import IconPlaying from '@/assets/svgr/iconPlaying.svg?react';
import IconLock from '@/assets/svgr/iconLock.svg?react';
import { Popup, Toast } from 'antd-mobile';
import styles from './index.module.less';
import type { IDramaDetailListItem } from '@/interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import { setLockNumDrawerVisible, setLockNumPageIndex } from '@/redux/actions/controls';
import translate from '@/utils/translation';
import useMountContainer from '@/hooks/useMountContainer';
import Image from '../Image';
interface ILockNum {
  caption: string;
  cover_url: string;
  list: IDramaDetailListItem['video_meta'][];
  activeIndex: number;
  numArrList: number[][];
  setLockAllDrawerOpen: (visible: boolean) => void;
  clickCallBack: (value: number) => void;
}

const LockNum: React.FC<ILockNum> = React.memo(
  ({ cover_url, caption, activeIndex, list, clickCallBack, numArrList, setLockAllDrawerOpen }) => {
    const dispatch = useDispatch();
    const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
    const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
    const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
    const pageIndex = useSelector((state: RootState) => state.controls.pageIndex);
    const visible = useSelector((state: RootState) => state.controls.lockNumDrawerVisible);
    const { getMountContainer } = useMountContainer();
    return (
      <Popup
        visible={visible}
        position={(isFullScreen || isCssFullScreen) && isHorizontal ? 'right' : 'bottom'}
        getContainer={getMountContainer()}
        onMaskClick={() => {
          dispatch(setLockNumDrawerVisible(false));
        }}
        bodyClassName={classNames(styles.popupLockBodyClass, {
          [styles.isFullScreen]: (isFullScreen || isCssFullScreen) && isHorizontal,
        })}
      >
        <div className={styles.head}>
          <div className={styles.title}>
            <div className={styles.coverImg}>
              <Image src={cover_url} alt="" />
            </div>
            <div className={styles.text}>
              <h3>{caption}</h3>
              <div className={styles.count}>{translate('d_all_episodes_placeholder', list.length)}</div>
            </div>
          </div>
          <div
            className={styles.lockBtn}
            onClick={() => {
              const hasVip = list.find(item => item.vip);
              if (hasVip) {
                setLockAllDrawerOpen(true);
              } else {
                Toast.show({
                  getContainer: getMountContainer(),
                  content: translate('d_unlock_all_episodes_placeholder'),
                });
              }
            }}
          >
            <IconLock />
            <span>{translate('d_unlock_all_episodes')}</span>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.numWrapper}>
            {numArrList.map((item, i) => {
              return (
                <div
                  className={classNames(styles.wrapper, { [styles.selected]: pageIndex === i })}
                  key={i}
                  onClick={() => {
                    dispatch(setLockNumPageIndex(i));
                  }}
                >
                  <span>{item.length === 1 ? item[0] : `${item[0]}-${item[item.length - 1]}`}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.numDetail}>
            {numArrList[pageIndex]?.map(item => {
              return (
                <span
                  className={classNames(styles.clickItem, { [styles.current]: activeIndex === item - 1 })}
                  key={item}
                  onClick={() => {
                    clickCallBack(item - 1);
                    dispatch(setLockNumDrawerVisible(false));
                  }}
                >
                  {item}
                  {activeIndex === item - 1 && (
                    <span className={styles.playingTag}>
                      <IconPlaying />
                    </span>
                  )}
                  {list[item - 1]['vip'] && (
                    <div className={styles.unLockTag}>
                      <IconLock />
                    </div>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </Popup>
    );
  },
);

export default LockNum;
