import { createRoot } from 'react-dom/client';
// @ts-expect-error
import { Plugin } from '@byteplus/veplayer';
import ExpandLeft from '@/components/expandLeft';
import { Provider } from 'react-redux';

import store from '@/redux/store';

const { POSITIONS } = Plugin;

export default class ExpandLeftPlugin extends Plugin {
  static get pluginName() {
    return 'expandLeftPlugin';
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_LEFT,
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
        <ExpandLeft />
      </Provider>,
    );
  }

  destroy() {}

  render() {
    return `<div class="xg-veplayer-left-expand"></div>`;
  }
}
