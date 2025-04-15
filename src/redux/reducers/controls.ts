// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
const initialState = {
  playbackRate: 1,
  definition: '',
  playRateDrawerVisible: false,
  definitionDrawerVisible: false,
  commentDrawerVisible: false,
  pageIndex: 0,
  lockNumDrawerVisible: false,
};

const controlsReducer = (state = initialState, action: any = {}) => {
  switch (action.type) {
    case 'SET_PLAY_BACK_RATE':
      return { ...state, playbackRate: action.payload };
    case 'SET_DEFINITION':
      return { ...state, definition: action.payload };
    case 'SET_PLAY_BACK_PANEL_VISIBLE':
      return { ...state, playRateDrawerVisible: action.payload };
    case 'SET_DEFINITION_PANEL_VISIBLE':
      return { ...state, definitionDrawerVisible: action.payload };
    case 'SET_COMMENT_PANEL_VISIBLE':
      return { ...state, commentDrawerVisible: action.payload };
    case 'SET_LOCK_NUM_PAGE_INDEX':
      return { ...state, pageIndex: action.payload };
    case 'SET_LOCK_NUM_DRAWER_VISIBLE':
      return { ...state, lockNumDrawerVisible: action.payload };
    default:
      return state;
  }
};

export default controlsReducer;
