// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import style from './index.module.less';
import ReactDOM from 'react-dom';
import IconBack from '@/assets/svgr/iconBack.svg?react';
import Image from '../Image';
interface ISystemCoverProps {
  imgUrl: string;
  clickCallback: () => void;
  goBack: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SystemCover: React.FC<ISystemCoverProps> = ({ imgUrl, clickCallback, goBack }) => {
  if (window.playerSdk?.player?.root) {
    return ReactDOM.createPortal(
      <div onClick={clickCallback} className={style.systemCover}>
        <Image src={imgUrl} alt="systemCover" className={style.img} />
        <div className={style.back} onClick={goBack}>
          <IconBack />
        </div>
      </div>,
      window.playerSdk?.player?.root,
    );
  }
  return null;
};

export default SystemCover;
