import styles from './index.module.less';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import { NavBar } from 'antd-mobile';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import { os } from '@/utils';
import classNames from 'classnames';

const ExpandTop = () => {
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);
  const currentDetail = useSelector((state: RootState) => state.dramaDetail.currentDetail);

  return isFullScreen || isCssFullScreen ? (
    <div className={classNames(styles.wrapper, { [styles.isHorizontal]: isHorizontal })}>
      <NavBar
        backIcon={<IconBack />}
        className={styles.head}
        left={currentDetail.caption}
        onBack={() => {
          os.isIos ? window.playerSdk?.player?.exitCssFullscreen() : window.playerSdk?.player?.exitFullscreen();
        }}
      />
    </div>
  ) : null;
};

export default ExpandTop;
