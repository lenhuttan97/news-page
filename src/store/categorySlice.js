import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as rss from '../data/rssData'
import * as supabase from '../data/supabaseData'
import { setDataSource } from './settingsSlice'

export const fetchCategoryNews = createAsyncThunk(
  'category/fetchCategoryNews',
  async ({ categoryId, offset = 0, limit = 30 }, { getState }) => {
    const source = getState().settings.dataSource === 'supabase' ? supabase : rss
    return source.fetchCategoryNews(categoryId, { offset, limit })
  },
)

const initialState = {
  items: [],
  currentSlug: null,
  categoryLoading: true,
  loadingMore: false,
  error: null,
  requestId: null,
  nextOffset: 0,
  hasMore: true,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setDataSource, () => initialState)
      .addCase(fetchCategoryNews.pending, (state, action) => {
        const { categoryId, offset = 0 } = action.meta.arg
        const isNewPage = offset === 0 || state.currentSlug !== categoryId
        if (isNewPage) {
          state.items = []
          state.nextOffset = 0
          state.hasMore = true
          state.currentSlug = categoryId
          state.categoryLoading = true
          state.loadingMore = false
        } else {
          state.loadingMore = true
        }
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchCategoryNews.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        const { offset = 0 } = action.meta.arg
        const { items, nextOffset, hasMore } = action.payload
        if (offset > 0) {
          const seen = new Set(state.items.map((item) => item.id))
          state.items.push(...items.filter((item) => !seen.has(item.id)))
        } else {
          state.items = items
        }
        state.nextOffset = nextOffset
        state.hasMore = hasMore
        state.categoryLoading = false
        state.loadingMore = false
      })
      .addCase(fetchCategoryNews.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.categoryLoading = false
        state.loadingMore = false
        state.error = action.error.message || 'Lỗi tải dữ liệu'
      })
  },
})

export const selectCategoryEntry = (slug) => (state) => {
  if (state.category.currentSlug !== slug) {
    return { ...initialState, currentSlug: slug }
  }
  return state.category
}

export default categorySlice.reducer
