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
