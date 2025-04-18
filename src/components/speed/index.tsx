// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { setPlayBackRate, setPlayBackRatePanelVisible } from '@/redux/actions/controls';
import { RootState } from '@/redux/type';
import { Popup } from 'antd-mobile';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.less';
import translate from '@/utils/translation';
import { useEffect } from 'react';
export const playbackRateList = [
  {
    title: '2.0x',
    value: 2,
  },
  {
    title: '1.5x',
    value: 1.5,
  },
  {
    title: '1.25x',
    value: 1.25,
  },
  {
    title: '1x',
    value: 1,
  },
  {
    title: '0.75x',
    value: 0.75,
  },
];

const Speed = () => {
  const playbackRatePanelVisible = useSelector((state: RootState) => state.controls.playRateDrawerVisible);
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const playbackRate = useSelector((state: RootState) => state.controls.playbackRate);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setPlayBackRatePanelVisible(false));
    };
  }, []);

  return (
    <Popup
      visible={playbackRatePanelVisible}
      getContainer={isCssFullScreen || !isFullScreen ? document.body : window.playerSdk?.player?.root}
      onMaskClick={() => {
        dispatch(setPlayBackRatePanelVisible(false));
      }}
      position={(isFullScreen || isCssFullScreen) && isHorizontal ? 'right' : 'bottom'}
      bodyClassName={classNames(styles.popupBodyClass, {
        [styles.isFullScreen]: (isFullScreen || isCssFullScreen) && isHorizontal,
      })}
      maskClassName={styles.popupMaskClass}
    >
      <div className={styles.head}>{translate('d_playback_speed')}</div>
      <div className={styles.body}>
        {playbackRateList.map(item => (
          <div
            key={item.title}
            className={classNames(styles.item, { [styles.selected]: playbackRate === item.value })}
            onClick={() => {
              dispatch(setPlayBackRate(item.value));
              dispatch(setPlayBackRatePanelVisible(false));
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </Popup>
  );
};

export default Speed;
