import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import IconMute from '@/assets/svgr/iconMute.svg?react';
import IconClose from '@/assets/svgr/iconClose.svg?react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/type';
import classNames from 'classnames';

interface IAd {
  drama_id: string;
  visible: boolean;
  vid_list: string[];
  onClose: () => void;
  getLockData: () => void;
}
const Ad: React.FC<IAd> = ({ onClose, getLockData, visible }) => {
  const [count, setCount] = useState(10);
  const refTimer = useRef<number>();
  const isFullScreen = useSelector((state: RootState) => state.player.fullScreen);
  const isCssFullScreen = useSelector((state: RootState) => state.player.cssFullScreen);
  const isHorizontal = useSelector((state: RootState) => state.player.horizontal);

  useEffect(() => {
    if (visible) {
      clearInterval(refTimer.current);
      setCount(10);
      refTimer.current = setInterval(() => {
        setCount(prevCount => {
          if (prevCount === 0) {
            getLockData();
          }
          return prevCount >= 0 ? prevCount - 1 : prevCount;
        });
      }, 1000);
    }
  }, [visible]);

  return visible
    ? ReactDOM.createPortal(
        <div className={classNames(styles.wrapper, { [styles.isFullScreen]: isHorizontal && isFullScreen })}>
          <div className={styles.opeation}>
            <div className={styles.voice}>
              <span>Ad</span>
              <span className={styles.split}>|</span>
              <span>
                <IconMute />
              </span>
            </div>
            {count >= 0 ? (
              <div className={styles.count}>{count} s</div>
            ) : (
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <IconClose />
              </div>
            )}
          </div>
          <div className={styles.imgWrapper}>
            <img src="https://sf16-videoone.ibytedtos.com/obj/bytertc-platfrom-sg/cocacola.gif" alt="" />
          </div>
        </div>,
        isCssFullScreen ? document.body : window.playerSdk.player.root,
      )
    : null;
};

export default Ad;
