import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.less';
import flexible from '@/utils/flexible.ts';
import VePlayer from '@byteplus/veplayer';

flexible(window, document);

window.sessionStorage.setItem('user_id', String(Math.floor(10000 + Math.random() * 90000)));

VePlayer.prepare({
  appId: 597335, // Obtain from the video-on-demand console - VOD SDK - Application Management. Create one if not available.
  strategies: {
    preload: true,
    adaptRange: true,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
