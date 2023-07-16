import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../..';
import { CityData } from '../../../types/City';
import { Sort } from '../../../types/Sort';
import { WeatherAverage } from '../../../types/Weather';
import { addCashItem } from '../cash/cashSlice';
import { getTomorrowWR } from '../../../api/weather';

interface OptionType { value: string; label: string; }

export enum Status {
  fulfilled = 'fulfilled',
  pending = 'pending',
  rejected = 'rejected',
}
export interface ControlState {
  keys: OptionType[];
  selected: CityData[];
  displayed: CityData[];
  current: CityData | null;
  sortBy: Sort;
  order: boolean;

  loadingList: string[]
  errors: {id: string; message: string | null }[],
}

const initialState: ControlState = {
  keys: [],
  selected: [],
  displayed: [],
  current: null,
  sortBy: Sort.byPopulation,
  order: true,

  loadingList: [],
  errors: [],
};

export const getWeatherAsync  = createAsyncThunk(
  'getWeather',
  async (
    city: CityData, 
    { dispatch, rejectWithValue }) => {
      try {
        const res = await getTomorrowWR(city);

        const dailyMax = Math.max(...res.daily.temperature_2m_max);
        const dailyMin = Math.min(...res.daily.temperature_2m_min);
        const averageWind = Math.ceil(res.hourly.winddirection_10m.reduce((acc, el) => acc + el) / res.hourly.winddirection_10m.length);
        const daily_units = res.daily_units;

        dispatch(addCashItem( { ...city, weather: { dailyMax, dailyMin, averageWind, daily_units } }));

        return { dailyMax, dailyMin, averageWind, daily_units } as WeatherAverage;
      } catch (error) {
        console.error(`Error during loading loadWeather ${city.name}`, error);
        return rejectWithValue(`Error during loading loadWeather ${city.name} - ${error}` as string);
      }
  },
);


const controlSlice = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    saveKeys: (state, action) => {
      state.keys = action.payload;
    },
    addChosenCountry: (state: ControlState, action: PayloadAction<CityData[]>) => {
      const newDisplayedObj: { [key: string]: CityData } = {}

      for (const key of [...action.payload, ...state.selected]) {
        newDisplayedObj[key.geoNameId] = key;
      }

      if (state.selected.length) {
        const selectedCitiesGeoNameId = state.selected.map(c => c.geoNameId);

        state.displayed = ([...action.payload.filter(c => !selectedCitiesGeoNameId.includes(c.geoNameId)), ...state.selected]);       
      } else {
        state.displayed = action.payload;
      }
    },
    addSelected: (state: ControlState, action: PayloadAction<CityData>) => {
      state.selected = [...state.selected, action.payload];
    },
    removeSelected: (state: ControlState, action: PayloadAction<CityData>) => {
      state.selected = state.selected.filter(c => c.geoNameId !== action.payload.geoNameId);
    },
    setCurrent: (state: ControlState, { payload }: PayloadAction<CityData>) => {
      state.current = state.current?.geoNameId !== payload.geoNameId ? payload : null;
    },
    checkCurrent: (state: ControlState) => {     
      const isVisible = state.displayed.find(c => c.geoNameId === state.current?.geoNameId); 
      state.current = isVisible ? state.current : state.displayed[0] || state.selected[0] || null;
    },
    sortTable: (state: ControlState, { payload }: PayloadAction<Sort | undefined>) => {
      if (payload !== undefined) {
        state.sortBy = payload === state.sortBy ? state.sortBy : payload;
        state.order = payload === state.sortBy ? !state.order : true;
      }

      const orderValue = state.order ? 1 : -1;
      
      switch (state.sortBy) {
        case Sort.byNames:
          state.displayed = [...state.displayed].sort((a, b) => orderValue * a.name.localeCompare(b.name));
          break;
    
        case Sort.byMax:
          state.displayed = [...state.displayed].sort((a, b) => orderValue * (Number(a.weather?.dailyMax) - Number(b.weather?.dailyMax)));
          break;
    
        case Sort.byMin:
          state.displayed = [...state.displayed].sort((a, b) => orderValue * (Number(a.weather?.dailyMin) - Number(b.weather?.dailyMin)));
          break;
    
        default:
          state.displayed = [...state.displayed].sort((a, b) => orderValue * (Number(a.population) - Number(b.population)));
      }
    },
    setDisplayed: (state: ControlState, action: PayloadAction<CityData[]>) => {
      state.displayed = action.payload;
    },
    resetState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherAsync.pending, (state: ControlState, { meta }) => {
        state.loadingList = [ ...state.loadingList, meta.arg.geoNameId];
        state.errors = state.errors.filter(e => e.id !== meta.arg.geoNameId);
      })
      .addCase(getWeatherAsync.fulfilled, (state, { meta }) => {
        state.loadingList = state.loadingList.filter(c => c === meta.arg.geoNameId);
      })
      .addCase(getWeatherAsync.rejected, (state, { payload, meta}) => {
        state.loadingList = state.loadingList.filter(c => c === meta.arg.geoNameId);
        state.errors = [ ...state.errors, ({ id: meta.arg.geoNameId, message: payload as string })];
      })
  },
});

export default controlSlice.reducer;
export const {
  saveKeys,
  addChosenCountry,
  addSelected,
  removeSelected,
  setCurrent,
  checkCurrent,
  sortTable,
  setDisplayed,
  resetState,
} = controlSlice.actions;

export const selectKeys = (state: RootState) => state.control.keys;
export const selectSelected = (state: RootState) => state.control.selected;
export const selectDisplayed = (state: RootState) => state.control.displayed;
export const selectCurrent = (state: RootState) => state.control.current;
export const selectSortBy = (state: RootState) => state.control.sortBy;
export const selectOrder = (state: RootState) => state.control.order;
export const selectLoadingList = (state: RootState) => state.control.loadingList;
export const selectErrors = (state: RootState) => state.control.errors;
