import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/home';
import TTShow from '@/pages/ttshow';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import { useEffect } from 'react';
import Drama from './pages/drama';
import VePlayer from '@byteplus/veplayer';
import ChannelDetail from './pages/drama/ChannelDetail';
import { Provider } from 'react-redux';
import store from './redux/store';

const axios = Axios.create({
  baseURL: __API_URL__,
});

configure({ axios });

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/ttshow',
      element: <TTShow />,
    },
    {
      path: '/dramaGround',
      element: <Drama />,
    },
    {
      path: '/dramaDetail',
      element: <ChannelDetail />,
    },
  ],
  { basename: '/videoone' },
);

function importVconsole() {
  const params = new URLSearchParams(window.location.search);

  if (params.get('vconsole') === '1') {
    import('vconsole')
      .then(v => {
        new v.default();
      })
      .catch(() => {
        return;
      });
  }
}

function App() {
  useEffect(() => {
    importVconsole();
    VePlayer.prepare({
      appId: 597335, // Obtain from the video-on-demand console - VOD SDK - Application Management. Create one if not available.
      strategies: {
        preload: true,
        adaptRange: true,
      },
    });
  }, []);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
