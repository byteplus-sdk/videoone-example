import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/home';
import TTShow from '@/pages/ttshow';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import { useEffect } from 'react';
import { loadScript } from './utils/util';
console.log('test');
const axios = Axios.create({
  baseURL: __API_URL__,
});

configure({ axios });

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/ttshow',
    element: <TTShow />,
  },
]);

function importVconsole() {
  const params = new URLSearchParams(window.location.search);

  if (params.get('vconsole') === '1') {
    loadScript('//unpkg.byted-static.com/vconsole/3.14.6/dist/vconsole.min.js').then(() => {
      new window.VConsole();
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
