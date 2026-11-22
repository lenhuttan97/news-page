import { createSlice } from '@reduxjs/toolkit';

const DATA_SOURCE_KEY = 'dataSource';
const MIX_SOURCES_KEY = 'mixSources';
export const DATA_SOURCES = ['rss', 'supabase'];

function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    /* storage unavailable: keep in-memory choice */
  }
}

// On by default: only an explicit 'false' turns mixing off.
function readStoredMix() {
  try {
    return localStorage.getItem(MIX_SOURCES_KEY) !== 'false';
  } catch (error) {
    return true;
  }
}

function readStoredSource() {
  try {
    const value = localStorage.getItem(DATA_SOURCE_KEY);
    return DATA_SOURCES.includes(value) ? value : 'rss';
  } catch (error) {
    return 'rss';
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { dataSource: readStoredSource(), mixSources: readStoredMix() },
  reducers: {
    setDataSource(state, action) {
      state.dataSource = DATA_SOURCES.includes(action.payload) ? action.payload : 'rss';
      save(DATA_SOURCE_KEY, state.dataSource);
    },
    setMixSources(state, action) {
      state.mixSources = Boolean(action.payload);
      save(MIX_SOURCES_KEY, String(state.mixSources));
    },
  },
});

export const { setDataSource, setMixSources } = settingsSlice.actions;
export const selectDataSource = (state) => state.settings.dataSource;
export const selectMixSources = (state) => state.settings.mixSources;
export default settingsSlice.reducer;
