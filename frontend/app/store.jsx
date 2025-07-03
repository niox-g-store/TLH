// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// reducer Hot Module Replacement (HMR) with Vite
if (import.meta.hot) {
  import.meta.hot.accept('./reducers', () => {
    const newRootReducer = require('./reducers').default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
