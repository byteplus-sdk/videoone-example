import groovyWalkAnimation from '@/assets/lottie/groovyWalk.json';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import Home from '@/pages/home';
import TTShow from '@/pages/ttshow';
import { configure } from 'axios-hooks';
import Axios from 'axios';

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
  const { View } = useLottie({
    animationData: groovyWalkAnimation,
    loop: true,
  });

  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
