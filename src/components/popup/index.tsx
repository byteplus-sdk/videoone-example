import React, { memo, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import Portal from './portal';
import Close from '@/assets/svgr/close.svg?react';
import './index.less';

interface IProps {
  visible: boolean;
  position?: 'bottom' | 'top' | 'left' | 'right';
  maskClassName?: string;
  containerClassName?: string;
  getContainer?: any;
  title?: React.ReactNode;
  onMaskClick?: (e: React.MouseEvent) => void;
  onClose?: () => void;
  children: any;
}
const Popup: React.FC<IProps> = memo(props => {
  const { visible, children, position = 'bottom', maskClassName, containerClassName, getContainer } = props;
  const defaultPosition = position || 'bottom';

  const maskClass = cn('popup__mask', maskClassName);
  const containerClass = cn(`popup__wrapper popup__wrapper--${defaultPosition}`, containerClassName);

  const [curVisible, setCurVisible] = useState(visible);

  useEffect(() => {
    setCurVisible(visible);
  }, [visible]);

  function handleClose() {
    props.onClose?.();
  }

  function handleMaskClick() {
    props.onClose?.();
  }

  return (
    <Portal getContainer={getContainer}>
      <CSSTransition in={curVisible} timeout={300} classNames={defaultPosition} unmountOnExit>
        <div
          className="popup"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
        >
          <div className={maskClass} onClick={handleMaskClick}></div>
          <div className={containerClass}>
            <div className="popup__header">
              <span></span>
              <div className="popup__header__title">{props.title}</div>
              <span className="popup__header__close" onClick={handleClose}>
                <Close />
              </span>
            </div>
            <div className="popup__content">{children}</div>
          </div>
        </div>
      </CSSTransition>
    </Portal>
  );
});

export default Popup;
