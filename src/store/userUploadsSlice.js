import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from './apiClient'

export const fetchUserUploads = createAsyncThunk('userUploads/fetchUserUploads', () =>
  fetchJson('/api/news/uploads/me'),
)

const userUploadsSlice = createSlice({
  name: 'userUploads',
  initialState: {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetUserUploads(state) {
      state.items = []
      state.total = 0
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserUploads.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserUploads.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
      })
      .addCase(fetchUserUploads.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        state.items = []
        state.total = 0
      })
  },
})

export const { resetUserUploads } = userUploadsSlice.actions

export default userUploadsSlice.reducer
