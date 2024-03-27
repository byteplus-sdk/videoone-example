import React, { memo, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import Portal from './portal';
import './index.less';

interface IProps {
  visible: boolean;
  position?: 'bottom' | 'top' | 'left' | 'right';
  maskClassName?: string;
  contentClassName?: string;
  getContainer?: any;
  onMaskClick: (e: React.MouseEvent) => void;
  children: any;
}
const Popup: React.FC<IProps> = memo(props => {
  const { visible, children, position = 'bottom', maskClassName, contentClassName, getContainer, onMaskClick } = props;
  const defaultPosition = position || 'bottom';

  const maskClass = cn('popup__mask', maskClassName);
  const contentClass = cn(`popup__content popup__content--${defaultPosition}`, contentClassName);

  const [curVisible, setCurVisible] = useState(visible);

  useEffect(() => {
    setCurVisible(visible);
  }, [visible]);

  return (
    <Portal getContainer={getContainer}>
      <CSSTransition in={curVisible} timeout={300} classNames={defaultPosition} unmountOnExit>
        <div className="popup">
          <div className={maskClass} onClick={onMaskClick}></div>
          <div className={contentClass}>{children}</div>
        </div>
      </CSSTransition>
    </Portal>
  );
});

export default Popup;
