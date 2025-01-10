import React from 'react';
import styles from './index.module.less';
import logo from '@/assets/images/logo.png';
import IconQuality from '@/assets/svgr/iconQuality.svg?react';
import IconEnter from '@/assets/svgr/iconEnter.svg?react';
import { useNavigate } from 'react-router-dom';

import t from '@/utils/translation';
const Menus = [
  {
    navigateUrl: '/dramaGround?device_id=001',
    title: t('home_drama_tit'),
    desc: t('home_drama_desc'),
    background:
      'http://p16-imagex-sg.' +
      window.atob('dm9sY2ltYWdleC5jb20=') +
      '/tos-alisg-i-0d8x0d4ylr-sg/7c129a17bb51cd0e7bcc1f87a6666b4f.png~tplv-0d8x0d4ylr-resize:0:q75.webp',
    borderLinerColors: ['#9a912f', '#3f411c'],
    bgLinerColors: ['#4A4C20', '#40421D'],
  },
  {
    navigateUrl: '/ttshow',
    title: t('home_video_tit'),
    desc: t('home_video_desc'),
    background:
      'http://p16-imagex-sg.' +
      window.atob('dm9sY2ltYWdleC5jb20=') +
      '/tos-alisg-i-0d8x0d4ylr-sg/a71e33ae8f724686c0ba406549fed6df.png~tplv-0d8x0d4ylr-resize:0:q75.webp',
    borderLinerColors: ['#45B1E5', '#3797C4'],
    bgLinerColors: ['#399FC6', '#399FC6'],
  },
];
const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="byteplus logo" />
      </div>
      <h1 className={styles.tit}>{t('home_title')}</h1>
      <p>{t('home_welcome')}</p>

      {Menus.map((menu, index) => {
        return (
          <div
            className={styles.videoEntryCoverOuter}
            style={{
              background: `linear-gradient(to bottom, ${menu.borderLinerColors[0]}, ${menu.borderLinerColors[1]})`,
            }}
          >
            {index === 0 && (
              <div style={{ background: menu.borderLinerColors[0] }} className={styles.newTag}>
                NEW
              </div>
            )}
            <div
              className={styles.videoEntryCover}
              style={{ background: `url(${menu.background})` }}
              onClick={() => navigate(menu.navigateUrl)}
              key={index}
            >
              <div className={styles.quality}>
                <IconQuality />
                <span>1080P</span>
              </div>
              <div
                className={styles.introBgWrapper}
                style={{
                  background: `linear-gradient(transparent 15%, ${menu.bgLinerColors[0]} 40%, ${menu.bgLinerColors[1]})`,
                }}
              >
                <div className={styles.introWrapper}>
                  <div className={styles.content}>
                    <h2>{menu.title}</h2>
                    <p>{menu.desc}</p>
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
      })}
    </div>
  );
};

export default Home;
