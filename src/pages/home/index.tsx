import React from 'react';
import styles from './index.module.less';
import logo from '../../assets/images/logo.png';
import IconQuality from '../../assets/svgs/iconQuality.svg';
import IconEnter from '../../assets/svgs/iconEnter.svg';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="byteplus logo" />
            </div>
            <h1 className={styles.tit}>VideoOne Center</h1>
            <p>Welcome to the VideoOne Demo Center! Please select the scene of interest.</p>
            <div className={styles.videoEntryCover} >
                <div className={styles.quality} >
                    <img src={IconQuality} alt="" />
                    <span>1080P</span>
                </div>
                <div className={styles.introBgWrapper} >
                    <div className={styles.introWrapper} >
                        <div className={styles.content} >
                            <h2>Interactive short video</h2>
                            <p>Swipe up video, smooth playback, and video interaction experience</p>
                        </div>
                        <div className={styles.enterWrapper} >
                            <div className={styles.enter}>
                                <img src={IconEnter} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home