import React from 'react';
import styles from './index.module.less';
import logo from '@/assets/images/logo.png';
import IconQuality from '@/assets/svgr/iconQuality.svg?react';
import IconEnter from '@/assets/svgr/iconEnter.svg?react';
import { useNavigate } from 'react-router-dom';

import t from '@/utils/translation';
import { imgUrl } from '@/utils';
const Menus = [
  {
    navigateUrl: '/dramaGround?device_id=001',
    title: t('home_drama_tit'),
    desc: t('home_drama_desc'),
    background: imgUrl(
      '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/36854f7160573ca841fd9a3155ed5dc8.webp~tplv-j963mrpdmh-image.image',
    ),

    borderLinerColors: ['#9a912f', '#3f411c'],
    bgLinerColors: ['#4A4C20', '#40421D'],
  },
  {
    navigateUrl: '/ttshow',
    title: t('home_video_tit'),
    desc: t('home_video_desc'),
    background: imgUrl(
      'https://p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/1d7941721d915b10b1b63fcc94ba0d75.png~tplv-j963mrpdmh-image.image',
    ),
    borderLinerColors: ['#45B1E5', '#3797C4'],
    bgLinerColors: ['#399FC6', '#399FC6'],
  },
];
const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      style={{
        background: `url(${imgUrl('//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/55135ebccd537641590ca8a2977e04e4.png~tplv-j963mrpdmh-image.image')}) no-repeat`,
      }}
    >
      <div className={styles.logo}>
        <img src={logo} alt="byteplus logo" />
      </div>
      <h1 className={styles.tit}>{t('home_title')}</h1>
      <p>{t('home_welcome')}</p>

      {Menus.map((menu, index) => {
        return (
          <div
            className={styles.videoEntryCoverOuter}
            key={index}
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
              {index === 1 && (
                <div className={styles.quality}>
                  <IconQuality />
                  <span>1080P</span>
                </div>
              )}
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
