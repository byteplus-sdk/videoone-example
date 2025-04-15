// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Emoji from '@/assets/svgr/iconEmoji.svg?react';
import styles from './index.module.less';
import translate from '@/utils/translation';

interface IProps {
  handleEnter: (val: string) => void;
}

const InputBar: React.FC<IProps> = props => {
  const [val, setVal] = useState('');

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && val.trim().length !== 0) {
      props.handleEnter(val);
      setVal('');
    }
  }

  return (
    <div className={styles.inputWrapper}>
      <input
        placeholder={translate('c_add')}
        value={val}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setVal(e.target.value);
        }}
        enterKeyHint="send"
        onKeyDown={handleKeyDown}
      />
      <div className={styles.emojiWrapper}>
        <Emoji />
      </div>
    </div>
  );
};

export default InputBar;
