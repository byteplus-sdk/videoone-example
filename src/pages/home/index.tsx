import React from 'react';
import styles from './index.module.less';
import logo from '@/assets/images/logo.png';
import IconQuality from '@/assets/svgr/iconQuality.svg?react';
import IconEnter from '@/assets/svgr/iconEnter.svg?react';
import { useNavigate } from 'react-router-dom';
import t from '@/utils/translation';
const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="byteplus logo" />
      </div>
      <h1 className={styles.tit}>{t('home_title')}</h1>
      <p>{t('home_welcome')}</p>
      <div className={styles.videoEntryCover} onClick={() => navigate('/ttshow')}>
        <div className={styles.quality}>
          <IconQuality />
          <span>1080P</span>
        </div>
        <div className={styles.introBgWrapper}>
          <div className={styles.introWrapper}>
            <div className={styles.content}>
              <h2>{t('home_video_tit')}</h2>
              <p>{t('home_video_desc')}</p>
            </div>
            <div className={styles.enterWrapper}>
              <div className={styles.enter}>
                <IconEnter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
