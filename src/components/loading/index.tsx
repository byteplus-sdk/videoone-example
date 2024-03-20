import React from 'react';
import style from './index.module.less';
const Loading: React.FC = () => {
  return (
    <div className={style.loading}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
