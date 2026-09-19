import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice';
import themeReducer, { applyThemeClass, listenToThemeChanges } from './themeSlice';

const store = configureStore({
  reducer: {
    news: newsReducer,
    theme: themeReducer,
  },
});

applyThemeClass(store.getState().theme.resolved);
listenToThemeChanges(store);

export default store;