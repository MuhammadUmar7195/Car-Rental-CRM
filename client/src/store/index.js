import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slices/auth.slice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})