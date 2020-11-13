import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

const initialState = {};
const logger = createLogger({ collapsed: true });

const store = createStore(reducers, initialState, applyMiddleware(thunk, logger));

export default store;
