import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/home';
import TTShow from '@/pages/ttshow';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import { useEffect } from 'react';
import DramaGround from './pages/dramaGround';

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
      path: '/drama',
      element: <DramaGround />,
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
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
