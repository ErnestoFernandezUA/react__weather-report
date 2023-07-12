import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../..';
import { CityData } from '../../../types/City';
import { Sort } from '../../../types/Sort';

export interface ControlState {
  country: CityData[],
  selected: CityData[],
  current: CityData | null,
  sortBy: Sort;
  order: boolean;
}

const initialState: ControlState = {
  country: [],
  selected: [],
  current: null,
  sortBy: Sort.byPopulation,
  order: true,
};

const controlSlice = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    addChosenCountry: (state: ControlState, action: PayloadAction<CityData[]>) => {
      if (state.selected.length) {
        const selectedCitiesGeoNameId = state.selected.map(c => c.geoNameId);

        state.country = (action.payload.filter(c => !selectedCitiesGeoNameId.includes(c.geoNameId)));
      } else {
        state.country = action.payload;
      }
    },
    addSelected: (state: ControlState, action: PayloadAction<CityData>) => {
      state.country = state.country.filter(c => c.geoNameId !== action.payload.geoNameId);
      state.selected = [...state.selected, action.payload];
    },
    removeSelected: (state: ControlState, action: PayloadAction<CityData>) => {
      state.selected = state.selected.filter(c => c.geoNameId !== action.payload.geoNameId);
      state.country = [ ...state.country, action.payload];
    },
    setCurrent: (state: ControlState, { payload }: PayloadAction<CityData>) => {
      state.current = state.current?.geoNameId !== payload.geoNameId ? payload : null;
    },
    checkCurrent: (state: ControlState) => {     
      const isVisible = [...state.country, ...state.selected].find(c => c.geoNameId === state.current?.geoNameId) 

      state.current = isVisible ? state.current : state.country[0] || state.selected[0] || null;
    },
    sort: (state: ControlState, action: PayloadAction<Sort>) => {
      if (state.sortBy === action.payload) {
        state.order = !state.order;
      } else {
        state.sortBy = action.payload;
        state.order = true;
      }
    },
    resetState: () => {
      return initialState;
    },
  },
});

export default controlSlice.reducer;
export const {
  addChosenCountry,
  addSelected,
  removeSelected,
  setCurrent,
  checkCurrent,
  sort,
  resetState,
} = controlSlice.actions;

export const selectCountry = (state: RootState) => state.control.country;
export const selectSelected = (state: RootState) => state.control.selected;
export const selectCurrent = (state: RootState) => state.control.current;
export const selectSortBy = (state: RootState) => state.control.sortBy;
export const selectOrder = (state: RootState) => state.control.order;
