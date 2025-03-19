import type { IDramaDetailListItem } from '@/interface';

export const setList = (list: IDramaDetailListItem['video_meta'][]) => ({
  type: 'SET_LIST',
  payload: list,
});

export const setDetail = (data: IDramaDetailListItem['video_meta']) => ({
  type: 'SET_DETAIL',
  payload: data,
});

export const updateDetail = (data: { [k: string]: any }) => ({
  type: 'UPDATE_DETAIL',
  payload: data,
});

export const resetDetail = () => ({
  type: 'RESET_DETAIL',
});
