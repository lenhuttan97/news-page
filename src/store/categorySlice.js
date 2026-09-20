import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCategoryNews as fetchCategoryRSS } from '../data/rssData'

export const fetchCategoryNews = createAsyncThunk(
  'category/fetchCategoryNews',
  async (categoryId) => await fetchCategoryRSS(categoryId)
)

const initialState = {
  cache: {}, // slug -> { items, loading, error }
  currentSlug: null,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCurrentSlug(state, action) {
      state.currentSlug = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryNews.pending, (state, action) => {
        const slug = action.meta.arg
        const entry = state.cache[slug] || { items: [], loading: false, error: null }
        entry.loading = true
        entry.error = null
        state.cache[slug] = entry
      })
      .addCase(fetchCategoryNews.fulfilled, (state, action) => {
        const entry = state.cache[action.meta.arg]
        if (entry) {
          entry.loading = false
          entry.items = action.payload
        }
      })
      .addCase(fetchCategoryNews.rejected, (state, action) => {
        const entry = state.cache[action.meta.arg]
        if (entry) {
          entry.loading = false
          entry.error = action.error.message || 'Lỗi tải dữ liệu'
        }
      })
  },
})

export const { setCurrentSlug } = categorySlice.actions
export const selectCurrentSlug = (state) => state.category.currentSlug
// Uncached slug = never fetched yet → treat as loading (avoids flashing
// "no articles" before the fetch thunk's pending case runs).
export const selectCategoryEntry = (slug) => (state) =>
  state.category.cache[slug] || { items: [], loading: true, error: null }
export default categorySlice.reducer