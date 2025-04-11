// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './index.module.less';
import logo from '@/assets/images/logo.png';
import IconQuality from '@/assets/svgr/iconQuality.svg?react';
import IconEnter from '@/assets/svgr/iconEnter.svg?react';
import { useNavigate } from 'react-router-dom';
import translate from '@/utils/translation';
import { imgUrl } from '@/utils';

const MENU_ITEMS = [
  {
    navigateUrl: '/dramaGround',
    title: translate('home_drama_tit'),
    desc: translate('home_drama_desc'),
    background: imgUrl(
      '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/36854f7160573ca841fd9a3155ed5dc8.webp~tplv-j963mrpdmh-image.image',
    ),
    borderLinerColors: ['#9a912f', '#3f411c'],
    bgLinerColors: ['#4A4C20', '#40421D'],
    isNew: true,
  },
  {
    navigateUrl: '/ttshow',
    title: translate('home_video_tit'),
    desc: translate('home_video_desc'),
    background: imgUrl(
      '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/1d7941721d915b10b1b63fcc94ba0d75.png~tplv-j963mrpdmh-image.image',
    ),
    borderLinerColors: ['#45B1E5', '#3797C4'],
    bgLinerColors: ['#399FC6', '#399FC6'],
    hasQualityBadge: true,
  },
];

interface MenuCardProps {
  item: (typeof MENU_ITEMS)[0];
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick }) => {
  const { background, borderLinerColors, bgLinerColors, isNew, hasQualityBadge, title, desc } = item;

  return (
    <div
      className={styles.videoEntryCoverOuter}
      style={{
        background: `linear-gradient(to bottom, ${borderLinerColors[0]}, ${borderLinerColors[1]})`,
      }}
    >
      {isNew && (
        <div style={{ background: borderLinerColors[0] }} className={styles.newTag}>
          NEW
        </div>
      )}
      <div className={styles.videoEntryCover} style={{ background: `url(${background})` }} onClick={onClick}>
        {hasQualityBadge && (
          <div className={styles.quality}>
            <IconQuality />
            <span>1080P</span>
          </div>
        )}
        <div
          className={styles.introBgWrapper}
          style={{
            background: `linear-gradient(transparent 15%, ${bgLinerColors[0]} 40%, ${bgLinerColors[1]})`,
          }}
        >
          <div className={styles.introWrapper}>
            <div className={styles.content}>
              <h2>{title}</h2>
              <p>{desc}</p>
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const backgroundImage = imgUrl(
    '//p16-live-sg.ibyteimg.com/tos-alisg-i-j963mrpdmh/55135ebccd537641590ca8a2977e04e4.png~tplv-j963mrpdmh-image.image',
  );

  return (
    <div
      className={styles.container}
      style={{
        background: `url(${backgroundImage}) no-repeat`,
      }}
    >
      <div className={styles.logo}>
        <img src={logo} alt="byteplus logo" />
      </div>
      <h1 className={styles.tit}>{translate('home_title')}</h1>
      <p>{translate('home_welcome')}</p>

      {MENU_ITEMS.map(item => (
        <MenuCard key={item.navigateUrl} item={item} onClick={() => navigate(item.navigateUrl)} />
      ))}
    </div>
  );
};

export default Home;
