import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from './apiClient'

export const fetchNews = createAsyncThunk('news/fetchNews', () => fetchJson('/api/news'))

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default newsSlice.reducer
