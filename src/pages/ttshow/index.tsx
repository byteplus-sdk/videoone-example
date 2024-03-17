import React from 'react';
import useAxios from 'axios-hooks';
import { API_PATH } from '@/service/path';

const TTShow: React.FC = () => {
  const [{ data, loading, error }] = useAxios({
    url: API_PATH.GetPlayListDetail,
    method: 'POST',
  });

  console.log(loading, data, error);
  return <div>123123</div>;
};

export default TTShow;
