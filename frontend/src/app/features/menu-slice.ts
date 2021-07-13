import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const stateInit = {
  menuOnTopClass: '',
  menuActiveClass: '',
  selectedItemIndex: -1,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState: stateInit,
  reducers: {
    setMenuOnTop: state => {
      state.menuOnTopClass = 'menu-on-top';
    },

    removeMenuFromTop: state => {
      state.menuOnTopClass = '';
    },

    setMenuActive: state => {
      state.menuActiveClass = 'active';
    },

    removeMenuActive: state => {
      state.menuActiveClass = '';
    },

    setSelectedItemIndex: (state, action: PayloadAction<number>) => {
      state.selectedItemIndex = action.payload;
    },
  },
});

export const {
  setMenuOnTop,
  removeMenuFromTop,
  removeMenuActive,
  setMenuActive,
  setSelectedItemIndex,
} = menuSlice.actions;

export default menuSlice.reducer;
