import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeRole: 'customer', // 'customer' | 'vendor' | 'super_admin'
  formData: {
    customer: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
    vendor: {
      storeId: '',
      email: '',
      password: '',
      rememberMe: false,
    },
    super_admin: {
      adminId: '',
      password: '',
      securityPin: '',
    },
  },
  showPassword: false,
  isLoading: false,
  loggedInUser: null,
  errorMessage: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload
      state.showPassword = false
      state.errorMessage = ''
      state.loggedInUser = null
    },
    updateField: (state, action) => {
      const { role, field, value } = action.payload
      if (state.formData[role]) {
        state.formData[role][field] = value
      }
    },
    togglePassword: (state) => {
      state.showPassword = !state.showPassword
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.errorMessage = action.payload
      state.isLoading = false
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.errorMessage = ''
      state.loggedInUser = action.payload
    },
    logout: (state) => {
      state.loggedInUser = null
      state.errorMessage = ''
    },
  },
})

export const {
  setActiveRole,
  updateField,
  togglePassword,
  setLoading,
  setError,
  loginSuccess,
  logout,
} = authSlice.actions

export default authSlice.reducer
