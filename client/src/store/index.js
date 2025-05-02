import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import authReducer from './reducers/authReducer';
import contentReducer from './reducers/contentReducer';
import uiReducer from './reducers/uiReducer';

// Root Reducer
const rootReducer = combineReducers({
  auth: authReducer,
  content: contentReducer,
  ui: uiReducer
});

// Create Store
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;