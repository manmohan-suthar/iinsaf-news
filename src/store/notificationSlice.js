import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson, postJson } from './apiClient'
import { logoutUser } from './authSlice'

function createInitialState() {
  return {
    items: [],
    status: 'idle',
    error: null,
  }
}

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', () =>
  fetchJson('/api/notifications'),
)

export const markNotificationsRead = createAsyncThunk('notifications/markNotificationsRead', () =>
  postJson('/api/notifications/read'),
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: createInitialState(),
  reducers: {
    clearNotifications: () => createInitialState(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(logoutUser.fulfilled, () => createInitialState())
  },
})

export const { clearNotifications } = notificationSlice.actions

export default notificationSlice.reducer
