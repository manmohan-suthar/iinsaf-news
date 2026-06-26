import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import categoriesReducer from './categorySlice'
import newsReducer from './newsSlice'
import notificationsReducer from './notificationSlice'
import profileReducer from './profileSlice'
import publicProfileReducer from './publicProfileSlice'
import reportersReducer from './reporterSlice'
import userUploadsReducer from './userUploadsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    categories: categoriesReducer,
    reporters: reportersReducer,
    notifications: notificationsReducer,
    profile: profileReducer,
    publicProfile: publicProfileReducer,
    userUploads: userUploadsReducer,
  },
})
