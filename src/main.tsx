import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.less';
import flexible from '@/utils/flexible.ts';

flexible(window, document);

window.sessionStorage.setItem('user_id', String(Math.floor(10000 + Math.random() * 90000)));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
