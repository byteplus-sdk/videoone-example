import classNames from 'classnames';
import style from './index.module.less';
import ReactDOM from 'react-dom';
import IconBack from '@/assets/svgr/iconBack.svg?react';

interface ISystemCoverProps {
  imgUrl: string;
  clickCallback: () => void;
  goBack: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SystemCover: React.FC<ISystemCoverProps> = ({ imgUrl, clickCallback, goBack }) => {
  if (window.playerSdk?.player?.root) {
    return ReactDOM.createPortal(
      <div onClick={clickCallback} className={classNames(style.systemCover, {})}>
        <img src={imgUrl} alt="systemCover" />
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
