import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../..';
import { CityData } from '../../../types/City';

export interface ControlState {
  country: CityData[],
  selected: CityData[],
  current: CityData | null,
}

const initialState: ControlState = {
  country: [],
  selected: [],
  current: null,
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


    // addSelected111: (state: ControlState, action: PayloadAction<CityData>) => {
    //   state.selected.push(action.payload);
    // },
    // removeFromSelected111: (state: ControlState, action: PayloadAction<CityData>) => {
    //   state.selected = state.selected.filter(c => c.geoNameId !== action.payload.geoNameId);
    // },
    // addToCountry: (state: ControlState, action: PayloadAction<CityData>) => {
    //   state.country.push(action.payload);
    // },
    // removeFromCountry: (state: ControlState, action: PayloadAction<CityData>) => {
    //   state.country = state.selected.filter(c => c.geoNameId !== action.payload.geoNameId);
    // },
    setCurrent: (state: ControlState, { payload }: PayloadAction<CityData | null>) => {
      // AP=1 & PREV=1 => AP===PREV ? set : null
      // AP=1 & PREV=0 => set
      // AP=null & PREV=1 => isVisible? prev || c[0] || s[0] || null 
      // AP=null & PREV=null => c[0] || s[0] || null 

      if (payload) {
        state.current = state.current?.geoNameId !== payload.geoNameId ? payload : null;
      }

      const isVisible = [...state.country, ...state.selected].find(c => c.geoNameId === payload?.geoNameId) 

      state.current = isVisible ? state.current : state.country[0] || state.selected[0] || null;
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
  // addSelected111: addSelected111,
  // removeFromSelected111: removeFromSelected111,
  // addToCountry,
  // removeFromCountry,
  setCurrent,
  resetState,
} = controlSlice.actions;

export const selectCountry = (state: RootState) => state.control.country;
export const selectSelected = (state: RootState) => state.control.selected;
export const selectCurrent = (state: RootState) => state.control.current;