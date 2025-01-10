import { setPlayBackRate, setPlayBackRatePanelVisible } from '@/redux/actions/controls';
import { RootState } from '@/redux/type';
import { Popup } from 'antd-mobile';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.less';

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
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const playbackRate = useSelector((state: RootState) => state.controls.playbackRate);
  const dispatch = useDispatch();

  return (
    <Popup
      visible={playbackRatePanelVisible}
      getContainer={isFullScreen ? window.playerSdk?.player?.root : document.body}
      onMaskClick={() => {
        dispatch(setPlayBackRatePanelVisible(false));
      }}
      position={isFullScreen && isHorizontal ? 'right' : 'bottom'}
      bodyClassName={classNames(styles.popupBodyClass, { [styles.isFullScreen]: isFullScreen && isHorizontal })}
      maskClassName={styles.popupMaskClass}
    >
      <div className={styles.head}>Playback speed</div>
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
