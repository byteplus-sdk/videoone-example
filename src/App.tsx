import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/home';
import TTShow from '@/pages/ttshow';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import { useEffect } from 'react';
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

function App() {
  useEffect(() => {
    if (window.VConsole) {
      new window.VConsole();
    }
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
