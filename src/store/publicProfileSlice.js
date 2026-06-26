import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from './apiClient'

export const fetchPublicProfile = createAsyncThunk('publicProfile/fetchPublicProfile', (userId) =>
  fetchJson(`/api/users/${userId}/uploads`),
)

const publicProfileSlice = createSlice({
  name: 'publicProfile',
  initialState: {
    items: [],
    follow: {
      followersCount: 0,
      followingCount: 0,
      isFollowing: false,
    },
    profile: null,
    status: 'idle',
    total: 0,
    error: null,
  },
  reducers: {
    resetPublicProfile(state) {
      state.items = []
      state.follow = {
        followersCount: 0,
        followingCount: 0,
        isFollowing: false,
      }
      state.profile = null
      state.status = 'idle'
      state.total = 0
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProfile.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.follow = action.payload.follow || {
          followersCount: 0,
          followingCount: 0,
          isFollowing: false,
        }
        state.profile = action.payload.user
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        state.profile = null
        state.follow = {
          followersCount: 0,
          followingCount: 0,
          isFollowing: false,
        }
        state.items = []
        state.total = 0
      })
  },
})

export const { resetPublicProfile } = publicProfileSlice.actions

export default publicProfileSlice.reducer
