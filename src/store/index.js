import { configureStore } from '@reduxjs/toolkit'
import homeReducer, { fetchNews } from './homeSlice'
import categoryReducer from './categorySlice'
import settingsReducer from './settingsSlice'
import themeReducer, { applyThemeClass, listenToThemeChanges } from './themeSlice'

const store = configureStore({
  reducer: {
    home: homeReducer,
    category: categoryReducer,
    theme: themeReducer,
    settings: settingsReducer,
  },
})

applyThemeClass(store.getState().theme.resolved)
listenToThemeChanges(store)

export { fetchNews }
export default store