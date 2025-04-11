import React from 'react';
import style from './index.module.less';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', text }) => {
  return (
    <div className={`${style.loading} ${style[size]}`}>
      <div className={style.spinner}>
        <div className={style.dot}></div>
        <div className={style.dot}></div>
        <div className={style.dot}></div>
      </div>
      {text && <div className={style.text}>{text}</div>}
    </div>
  );
};

export default Loading;
