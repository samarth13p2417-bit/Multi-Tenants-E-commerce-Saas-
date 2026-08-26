import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import marketplaceReducer from '../features/marketplace/marketplaceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    marketplace: marketplaceReducer,
  },
})

export default store
