import classNames from 'classnames';
import style from './index.module.less';
import ReactDOM from 'react-dom';

interface ISystemCoverProps {
  imgUrl: string;
  clickCallback: () => void;
}

const SystemCover: React.FC<ISystemCoverProps> = ({ imgUrl, clickCallback }) => {
  if (window.playerSdk?.player?.root) {
    return ReactDOM.createPortal(
      <div onClick={clickCallback} className={classNames(style.systemCover, {})}>
        <img src={imgUrl} alt="systemCover" />
      </div>,
      window.playerSdk?.player?.root,
    );
  }
  return null;
};

export default SystemCover;
