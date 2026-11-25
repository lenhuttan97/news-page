import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as rss from '../data/rssData'
import * as supabase from '../data/supabaseData'
import { setDataSource } from './settingsSlice'

export const fetchNews = createAsyncThunk('home/fetchNews', async (options = {}, { getState }) => {
  const source = getState().settings.dataSource === 'supabase' ? supabase : rss
  return await source.fetchHomeNews(options)
})

const initialState = {
  items: [],
  loading: true,
  loadingMore: false,
  hasMore: true,
  nextOffset: 0,
  error: null,
  errorOffset: null,
  generation: 0,
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
        const isLoadMore = (action.meta.arg?.offset || 0) > 0
        state.loading = !isLoadMore
        state.loadingMore = isLoadMore
        if (!isLoadMore) state.generation += 1
        state.error = null
        state.errorOffset = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        if (!isLatest(state, action)) return
        state.loading = false
        state.loadingMore = false
        const { items, nextOffset, hasMore } = action.payload
        if ((action.meta.arg?.offset || 0) > 0) {
          const seen = new Set(state.items.map((item) => item.id))
          state.items.push(...items.filter((item) => !seen.has(item.id)))
        } else {
          state.items = items
        }
        state.nextOffset = nextOffset
        state.hasMore = hasMore
      })
      .addCase(fetchNews.rejected, (state, action) => {
        if (!isLatest(state, action)) return
        state.loading = false
        state.loadingMore = false
        state.error = action.error.message || 'Lỗi tải dữ liệu'
        state.errorOffset = action.meta.arg?.offset || 0
      })
  },
})

export const selectAllArticles = (state) => state?.home?.items || []
export default homeSlice.reducer
