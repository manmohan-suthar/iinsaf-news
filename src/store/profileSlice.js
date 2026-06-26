import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from './apiClient'

export const fetchProfile = createAsyncThunk('profile/fetchProfile', () => fetchJson('/api/profile'))

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    item: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.item = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default profileSlice.reducer
