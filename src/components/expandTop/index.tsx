import styles from './index.module.less';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import { NavBar } from 'antd-mobile';
import IconBack from '@/assets/svgr/iconBack.svg?react';

const ExpandTop = () => {
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const currentDetail = useSelector((state: RootState) => state.dramaDetail.currentDetail);

  return isFullScreen && isHorizontal ? (
    <div className={styles.wrapper}>
      <NavBar
        backIcon={<IconBack />}
        className={styles.head}
        left={currentDetail.caption}
        onBack={() => {
          window.playerSdk?.player?.exitFullscreen();
        }}
      />
    </div>
  ) : null;
};

export default ExpandTop;
