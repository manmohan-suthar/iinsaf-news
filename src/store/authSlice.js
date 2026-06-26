import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_BASE_URL, fetchJson, postJson, putForm } from './apiClient'

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', () => fetchJson('/api/auth/me'))
export const logoutUser = createAsyncThunk('auth/logoutUser', () => postJson('/api/auth/logout'))
export const saveUserLocation = createAsyncThunk('auth/saveUserLocation', (locationPayload) =>
  postJson('/api/auth/location', locationPayload),
)
export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', (profilePayload) => {
  const formData = new FormData()

  Object.entries(profilePayload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  return putForm('/api/auth/profile', formData)
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        state.user = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
      .addCase(saveUserLocation.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export function startGoogleLogin() {
  return () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`
  }
}

export default authSlice.reducer
