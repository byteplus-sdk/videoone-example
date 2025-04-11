import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import IconAllow from '@/assets/svgr/iconAllow.svg?react';
import IconNotAllow from '@/assets/svgr/iconNotAllow.svg?react';
import IconClose from '@/assets/svgr/iconClose.svg?react';
import { Button, Popup } from 'antd-mobile';
import styles from './index.module.less';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import translate from '@/utils/translation';
import type { IDramaDetailListItem } from '@/interface';
import useMountContainer from '@/hooks/useMountContainer';
import Image from '../Image';
interface ILockAll {
  cover_url: string;
  caption: string;
  count: number;
  vid: string;
  order: number;
  list: IDramaDetailListItem['video_meta'][];
  visible: boolean;
  loading: boolean;
  setLockAllDrawerOpen: (visible: boolean) => void;
  getLockData: (lockData: IDramaDetailListItem['video_meta'][]) => void;
}

const LockAll: React.FC<ILockAll> = React.memo(
  ({ cover_url, caption, count, visible, list, order, loading, setLockAllDrawerOpen, getLockData }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { getMountContainer } = useMountContainer();
    const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
    const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
    const isHorizontal = useSelector((state: RootState) => state.player.horizontal);

    const [part, all] = useMemo(() => {
      const part: IDramaDetailListItem['video_meta'][] = [];
      const all = list.filter(item => {
        if (item.vip && part.length < 3 && item.order >= order) {
          part.push(item);
        }
        return item.vip;
      });
      return [part, all];
    }, [list, order]);

    return (
      <Popup
        visible={visible}
        onMaskClick={() => {
          setLockAllDrawerOpen(false);
        }}
        position={(isFullScreen || isCssFullScreen) && isHorizontal ? 'right' : 'bottom'}
        getContainer={getMountContainer()}
        bodyClassName={classNames(styles.popupLockAllBodyClass, {
          [styles.isFullScreen]: (isFullScreen || isCssFullScreen) && isHorizontal,
        })}
      >
        <div className={styles.lockAllWrapper}>
          <div className={styles.header}>
            <span>{translate('d_unlock_multiple_episodes')}</span>
            <div
              className={styles.close}
              onClick={() => {
                setLockAllDrawerOpen(false);
              }}
            >
              <IconClose />
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.caption}>
              <div className={styles.coverImg}>
                <Image src={cover_url} alt="" />
              </div>
              <div className={styles.text}>
                <h3>{caption}</h3>
                <div className={styles.count}>{translate('d_all_episodes_placeholder', count)}</div>
              </div>
            </div>
            <div className={styles.tags}>
              <div>
                <IconAllow />
                {translate('d_permanent_viewing')}
              </div>
              <div>
                <IconNotAllow />
                {translate('d_no_refund')}
              </div>
            </div>
            <div className={styles.options}>
              <div
                onClick={() => {
                  setActiveIndex(0);
                }}
                className={classNames({ [styles.active]: activeIndex === 0 })}
              >
                <div>{translate('d_placeholder_episodes', part.length)}</div>
                <div>{translate('d_usd_placeholder', 15 * part.length)}</div>
              </div>
              <div
                className={classNames(styles.all, { [styles.active]: activeIndex === 1 })}
                onClick={() => {
                  setActiveIndex(1);
                }}
              >
                <div className={styles.title}>{translate('d_all_episodes')}</div>
                <div>
                  {translate('d_usd_placeholder', 0.6 * 15 * all.length)}
                  <span>({translate('d_usd_placeholder', 15 * all.length)})</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <Button
              className={styles.btn}
              color="danger"
              loading={loading}
              onClick={() => {
                getLockData(activeIndex === 0 ? part : all);
              }}
            >
              {translate('d_pay_for_usd_placeholder', activeIndex === 0 ? 15 * part.length : 0.6 * 15 * all.length)}
            </Button>
          </div>
        </div>
      </Popup>
    );
  },
);

export default LockAll;
