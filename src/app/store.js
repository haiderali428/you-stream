import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import videoReducer from './videoSlice';
import loaderReducer from './loaderSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    videos: videoReducer,
    loader: loaderReducer,
  },
});

export default store;
