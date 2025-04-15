// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/home';
import TTShow from '@/pages/ttshow';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import Drama from './pages/drama';
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
      path: 'ttshow',
      element: <TTShow />,
    },
    {
      path: 'dramaGround',
      element: <Drama />,
    },
    {
      path: 'dramaDetail',
      element: <ChannelDetail />,
    },
  ],
  {
    basename: '/videoone',
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
