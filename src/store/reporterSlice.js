import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from './apiClient'

export const fetchReporters = createAsyncThunk('reporters/fetchReporters', () => fetchJson('/api/reporters'))

const reporterSlice = createSlice({
  name: 'reporters',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReporters.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchReporters.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchReporters.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default reporterSlice.reducer
