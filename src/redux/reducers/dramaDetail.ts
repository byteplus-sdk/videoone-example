import { IDramaDetailListItem } from '@/@types';

const initialState = {
  list: [] as IDramaDetailListItem['video_meta'][],
  currentDetail: {} as IDramaDetailListItem['video_meta'],
};

const dramaDetailReducer = (state = initialState, action: any = {}) => {
  switch (action.type) {
    case 'SET_LIST':
      return { ...state, list: action.payload as IDramaDetailListItem['video_meta'][] };
    case 'RESET_DETAIL':
      return { ...state, list: [], currentDetail: {} as IDramaDetailListItem['video_meta'] };
    case 'SET_DETAIL':
      return { ...state, currentDetail: action.payload as IDramaDetailListItem['video_meta'] };
    case 'UPDATE_DETAIL':
      return {
        ...state,
        currentDetail: { ...state.currentDetail, ...((action.payload as IDramaDetailListItem['video_meta']) ?? {}) },
      };
    default:
      return state;
  }
};

export default dramaDetailReducer;
