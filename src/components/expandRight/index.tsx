import IconSpeed from '@/assets/svgr/iconLSpeed.svg?react';
import IconQuality from '@/assets/svgr/iconLQuality.svg?react';
import IconMenu from '@/assets/svgr/iconLMenu.svg?react';
import styles from './index.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import {
  setDefinitionPanelVisible,
  setLockNumDrawerVisible,
  setPlayBackRatePanelVisible,
} from '@/redux/actions/controls';
import { playbackRateList } from '../speed';

const ExpandRight = () => {
  const dispatch = useDispatch();
  const playbackRate = useSelector((state: RootState) => state.controls.playbackRate);
  const definition = useSelector((state: RootState) => state.controls.definition);
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const list = useSelector((state: RootState) => state.dramaDetail.list);

  return (isFullScreen || isCssFullScreen) && isHorizontal ? (
    <div className={styles.wrapper}>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          dispatch(setPlayBackRatePanelVisible(true));
        }}
      >
        <IconSpeed /> {playbackRateList.find(item => item.value === playbackRate)?.title}
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          dispatch(setDefinitionPanelVisible(true));
        }}
      >
        <IconQuality />
        {definition}
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          dispatch(setLockNumDrawerVisible(true));
        }}
      >
        <IconMenu /> {list.length}
      </div>
    </div>
  ) : null;
};

export default ExpandRight;
