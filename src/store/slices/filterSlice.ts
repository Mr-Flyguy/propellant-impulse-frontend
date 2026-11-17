import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  maxMolarMass: number;
  searchQuery: string;
}

const initialState: FilterState = {
  maxMolarMass: 64.0,
  searchQuery: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMaxMolarMass(state, action: PayloadAction<number>) {
      state.maxMolarMass = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetFilter(state) {
      state.maxMolarMass = initialState.maxMolarMass;
      state.searchQuery = initialState.searchQuery;
    },
  },
});

export const { setMaxMolarMass, setSearchQuery, resetFilter } = filterSlice.actions;

export default filterSlice.reducer;
