import { createSlice } from '@reduxjs/toolkit';

const THEME_KEY = 'theme';
const VALID_MODES = ['light', 'dark', 'system'];

function readStoredMode() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return VALID_MODES.includes(value) ? value : 'system';
  } catch (error) {
    return 'system';
  }
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

function resolveMode(mode) {
  return mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
}

export function applyThemeClass(resolved) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: readStoredMode(),
    resolved: resolveMode(readStoredMode()),
  },
  reducers: {
    setMode(state, action) {
      const mode = VALID_MODES.includes(action.payload) ? action.payload : 'system';
      state.mode = mode;
      state.resolved = resolveMode(mode);
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch (error) {
        /* storage unavailable: keep in-memory mode */
      }
      applyThemeClass(state.resolved);
    },
  },
});

export const { setMode } = themeSlice.actions;
export const selectThemeMode = (state) => state.theme.mode;
export const selectThemeResolved = (state) => state.theme.resolved;

export function listenToThemeChanges(store) {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (store.getState().theme.mode === 'system') {
      store.dispatch(setMode('system'));
    }
  };
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onChange);
  } else {
    mediaQuery.addListener(onChange);
  }
}

export default themeSlice.reducer;