import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchHomeNews, fetchCategoryNews as fetchCategoryRSS } from '../data/rssData';

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
  return await fetchHomeNews();
});

export const fetchCategoryNews = createAsyncThunk(
  'news/fetchCategoryNews',
  async (categoryId) => {
    return await fetchCategoryRSS(categoryId);
  }
);

const initialState = {
  items: [],
  categoryItems: [],
  loading: true,
  categoryLoading: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi tải dữ liệu';
      })
      .addCase(fetchCategoryNews.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
        state.categoryItems = [];
      })
      .addCase(fetchCategoryNews.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryItems = action.payload;
      })
      .addCase(fetchCategoryNews.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.error.message || 'Lỗi tải dữ liệu';
      });
  },
});

export const selectAllArticles = (state) => state?.news?.items || [];

export const selectCategoryArticles = (state) => state?.news?.categoryItems || [];

export default newsSlice.reducer;
