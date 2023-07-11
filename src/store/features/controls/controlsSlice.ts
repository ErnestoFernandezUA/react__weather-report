import {
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../..';

export interface SelectedState {
  popup: {
    // like this
    // showPopup1: boolean;
    // showPopup2: boolean;
  },
}

const initialState: SelectedState = {
  popup: {
  },
};

const controlSlice = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
  },
});

export default controlSlice.reducer;
export const {
  resetState,
} = controlSlice.actions;

// export const selectScreen = (state: RootState) => state.control.screen;
