import React, { memo } from 'react';
import { createPortal } from 'react-dom';

interface IProps {
  getContainer: any;
  children: any;
}
const Portal: React.FC<IProps> = memo(props => {
  const { children, getContainer = () => document.body } = props;
  const container = typeof getContainer === 'function' ? getContainer() : getContainer;

  if (container) {
    return createPortal(children, container);
  }
  return children;
});

export default Portal;
