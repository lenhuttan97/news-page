import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as rss from '../data/rssData'
import * as supabase from '../data/supabaseData'
import { setDataSource } from './settingsSlice'

export const fetchNews = createAsyncThunk('home/fetchNews', async (_, { getState }) => {
  const source = getState().settings.dataSource === 'supabase' ? supabase : rss
  return await source.fetchHomeNews()
})

const initialState = {
  items: [],
  loading: true,
  error: null,
  requestId: null,
}

// Only the latest request may write state, so a slow response from the
// previous data source cannot overwrite the new one.
const isLatest = (state, action) => state.requestId === action.meta.requestId

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setDataSource, () => initialState)
      .addCase(fetchNews.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        if (!isLatest(state, action)) return
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNews.rejected, (state, action) => {
        if (!isLatest(state, action)) return
        state.loading = false
        state.error = action.error.message || 'Lỗi tải dữ liệu'
      })
  },
})

export const selectAllArticles = (state) => state?.home?.items || []
export default homeSlice.reducer
