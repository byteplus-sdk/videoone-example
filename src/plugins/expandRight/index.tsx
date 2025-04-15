// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { createRoot } from 'react-dom/client';
// @ts-expect-error
import { Plugin } from '@byteplus/veplayer';
import ExpandRight from '@/components/expandRight';
import { Provider } from 'react-redux';

import store from '@/redux/store';

const { POSITIONS } = Plugin;

export default class ExpandRightPlugin extends Plugin {
  static get pluginName() {
    return 'expandRightPlugin';
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
    };
  }

  constructor(args: any) {
    super(args);
  }

  afterCreate() {
    // @ts-expect-error
    const root = createRoot(this.root);
    root.render(
      <Provider store={store}>
        <ExpandRight />
      </Provider>,
    );
  }

  destroy() {}

  render() {
    return `<div class="xg-veplayer-right-expand"></div>`;
  }
}
