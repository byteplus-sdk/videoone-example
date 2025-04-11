// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
interface Window {
  flexible: any;
  VePlayer: any;
  VConsole: any;
  playerSdk: VePlayer;
  mySize: any;
  VideooneSlardar?: any;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// 如果还需要普通 svg 导入
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}
