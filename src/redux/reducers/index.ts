// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { combineReducers } from 'redux';
import controls from './controls';
import dramaDetail from './dramaDetail';
import player from './player';

const rootReducer = combineReducers({
  controls,
  dramaDetail,
  player,
});

export default rootReducer;
