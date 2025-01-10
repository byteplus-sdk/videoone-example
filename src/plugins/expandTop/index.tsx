import { createRoot } from 'react-dom/client';
// @ts-ignore
import { Plugin } from '@byteplus/veplayer';
import ExpandTop from '@/components/expandTop';
import { Provider } from 'react-redux';

import store from '@/redux/store';

const { POSITIONS } = Plugin;

export default class ExpandTopPlugin extends Plugin {
  static get pluginName() {
    return 'expandTopPlugin';
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_TOP,
    };
  }

  constructor(args: any) {
    super(args);
  }

  afterCreate() {
    // @ts-ignore
    const root = createRoot(this.root);
    root.render(
      <Provider store={store}>
        <ExpandTop />
      </Provider>,
    );
  }

  destroy() {}

  render() {
    return `<div class="xg-veplayer-top-expand"></div>`;
  }
}
