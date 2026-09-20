import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchHomeNews } from '../data/rssData'

export const fetchNews = createAsyncThunk('home/fetchNews', async () => {
  return await fetchHomeNews()
})

const initialState = {
  items: [],
  loading: true,
  error: null,
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi tải dữ liệu'
      })
  },
})

export const selectAllArticles = (state) => state?.home?.items || []
export default homeSlice.reducer