import React, { ReactNode, memo, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import './index.less';
import ReactDOM, { Root } from 'react-dom/client';
import translation from '@/utils/translation';

interface IProps {
  visible: boolean;
  maskClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  cancelText?: string;
  okText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  title: ReactNode;
  content: ReactNode;
  root: Root;
}
const Dialog: any = memo((props: IProps) => {
  const { visible, maskClassName, contentClassName, footerClassName, headerClassName } = props;

  const maskClass = cn('dialog__mask', maskClassName);
  const headerClass = cn('dialog__header', headerClassName);
  const contentClass = cn('dialog__content', contentClassName);
  const footerClass = cn('dialog__footer', footerClassName);

  const [curVisible, setCurVisible] = useState(visible);

  useEffect(() => {
    setCurVisible(visible);
  }, [visible]);

  return (
    <CSSTransition in={curVisible} timeout={300} unmountOnExit classNames="fade">
      <div className="dialog">
        <div className={maskClass}></div>
        <div className="body-wrapper">
          <div className={contentClass}>
            {props.title && <div className={headerClass}>{props.title}</div>}
            {props.content}
          </div>
          <div className={footerClass}>
            <div
              className="cancel"
              onClick={() => {
                props.onCancel?.();
                props.root.unmount();
              }}
            >
              {props.cancelText || translation('c_cancel')}
            </div>
            <div
              onClick={() => {
                props.onConfirm?.();
                props.root.unmount();
              }}
              className="confirm"
            >
              {props.okText || translation('c_confirm')}
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
});

Dialog.confirm = (config: Partial<IProps>) => {
  let node = document.getElementById('my-dialog');
  if (!node) {
    node = document.createElement('div');
    node.id = 'my-dialog';
    document.body.appendChild(node);
  }
  const root: Root = ReactDOM.createRoot(node!);
  root.render(<Dialog visible root={root} {...config} />);
};

export default Dialog;
