import { combineReducers } from 'redux';
import PagesReducer from './pagesReducer';
import TableReducer from './tableReducer';
import SharedReducer from './sharedReducer';

export default combineReducers({
  pages: PagesReducer,
  table: TableReducer,
  shared: SharedReducer,
});
