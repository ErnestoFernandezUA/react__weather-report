import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { getTomorrowWR } from '../../../api/weather';

// eslint-disable-next-line import/no-cycle
import { RootState } from '../..';

import { Sort } from '../../../types/Sort';
import { CityData } from '../../../types/City';
import { isExpired } from '../../../utils/isExpired';
import { addCashItem } from '../cash/cashSlice';
import bigData from '../../../data/data.json';

interface OptionType { value: string; label: string; }

class CityError extends Error {
  constructor(public city: CityData, public cause: unknown) {
    super(`Error during loading loadWeather ${city.name}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CityError);
    }
  }
}

interface RejectedPayload {
  detailedWithWeather: CityData[];
  errors: { id: string; message: string | null }[];
}

export enum Status {
  idle = 'idle',
  fulfilled = 'fulfilled',
  pending = 'pending',
  rejected = 'rejected',
}
export interface ControlState {
  allData: { [key: string]: CityData[] };
  allKeys: OptionType[];

  selectedCountries: OptionType[];
  selected: CityData[];
  displayed: CityData[];
  current: CityData | null;
  sortBy: Sort;
  order: boolean;

  status: Status;

  loadingList: string[]
  errors: { id: string; message: string | null }[],
}

const initialState: ControlState = {
  allData: bigData.data,
  allKeys: bigData.keys,

  selectedCountries: [],
  selected: [],
  displayed: [],
  current: null,
  sortBy: Sort.byPopulation,
  order: true,

  status: Status.idle,

  loadingList: [],
  errors: [],
};

// export const getWeatherAsync  = createAsyncThunk(
//   'getWeather',
//   async (
//     city: CityData,
//     { dispatch, rejectWithValue, getState }) => {
//       const store = getState() as RootState;
//       const cash = store.cash.storage;

//       if (city.geoNameId in cash && !isExpired(cash[city.geoNameId].timerId)) {
//         return city;
//       }

//       try {
//         const res = await getTomorrowWR(city);

//         const dailyMax = Math.max(...res.daily.temperature_2m_max);
//         const dailyMin = Math.min(...res.daily.temperature_2m_min);
//         const averageWind = Math.ceil(res.hourly.winddirection_10m.reduce((acc, el) => acc + el) / res.hourly.winddirection_10m.length);
//         const daily_units = res.daily_units;

//         dispatch(addCashItem( { ...city, weather: { dailyMax, dailyMin, averageWind, daily_units } }));

//         return { ...city, weather: { dailyMax, dailyMin, averageWind, daily_units } };
//       } catch (error) {
//         console.error(`Error during loading loadWeather ${city.name}`, error);
//         return rejectWithValue(`Error during loading loadWeather ${city.name} - ${error}` as string);
//       }
//   },
// );

export const getWeatherAsyncAll = createAsyncThunk(
  'getWeatherAll',
  async (
    _,
    { dispatch, rejectWithValue, getState },
  ) => {
    const store = getState() as RootState;
    const cash = store.cash.storage;
    const { displayed } = store.controls;

    if (!displayed.length) {
      return [];
    }

    const errors: { id: string; message: string | null }[] = [];
    const detailedWithWeather: CityData[] = [];

    try {
      const result = await Promise.allSettled(displayed.map(async (city) => {
        if (city.geoNameId in cash
          && !isExpired(cash[city.geoNameId].timerId)) {
          return cash[city.geoNameId].city;
        }

        try {
          const res = await getTomorrowWR(city);

          const dailyMax = Math.max(...res.daily.temperature_2m_max);
          const dailyMin = Math.min(...res.daily.temperature_2m_min);
          const averageWind = Math.ceil(res.hourly.winddirection_10m.reduce(
            (acc: number, el: number) => acc + el,
          ) / res.hourly.winddirection_10m.length);
          const dailyUnits = res.daily_units;

          dispatch(addCashItem({
            ...city,
            weather: {
              dailyMax, dailyMin, averageWind, daily_units: dailyUnits,
            },
          }));

          return {
            ...city,
            weather: {
              dailyMax, dailyMin, averageWind, daily_units: dailyUnits,
            },
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error during loading loadWeather ${city.name}`, error);

          throw new CityError(city, error);
        }
      }));

      result.forEach((outcome) => {
        if (outcome.status === 'fulfilled') {
          detailedWithWeather.push(outcome.value);
        } else {
          const { city, error } = outcome.reason;

          errors.push({ id: city.geoNameId, message: `Error during loading loadWeather ${city.name}: ${error}` });

          detailedWithWeather.push(city);
        }
      });

      if (errors.length) {
        throw new Error('there are some errors');
      }
    } catch (err) {
      return rejectWithValue({ detailedWithWeather, errors });
    }

    return detailedWithWeather;
  },
);

const controlSlice = createSlice({
  name: 'controls',
  initialState,
  reducers: {
    saveKeys: (state, action) => {
      state.selectedCountries = action.payload;
    },
    changeDisplayed: (
      state: ControlState, action: PayloadAction<CityData[]>,
    ) => {
      if (state.selected.length) {
        const selectedCitiesGeoNameId = state.selected.map(c => c.geoNameId);

        state.displayed = ([...action.payload
          .filter(c => !selectedCitiesGeoNameId.includes(c.geoNameId)),
        ...state.selected,
        ]);
      } else {
        state.displayed = action.payload;
      }
    },
    addSelected: (state: ControlState, action: PayloadAction<CityData>) => {
      state.selected = [...state.selected, action.payload];
    },
    removeSelected: (
      state: ControlState,
      { payload }: PayloadAction<CityData>,
    ) => {
      state.selected = state.selected
        .filter(c => c.geoNameId !== payload.geoNameId);

      let isUnselectedButDisplayed = false;

      state.selectedCountries.forEach((option: OptionType) => {
        if (option.value in state.allData) {
          isUnselectedButDisplayed = !!state.allData[option.value]
            .find(c => c.geoNameId === payload.geoNameId);
        }
      });

      if (!isUnselectedButDisplayed) {
        state.displayed = state.displayed
          .filter(c => c.geoNameId !== payload.geoNameId);
      }
    },
    setCurrent: (state: ControlState, { payload }: PayloadAction<CityData>) => {
      state.current = state.current?.geoNameId !== payload.geoNameId
        ? payload
        : null;
    },
    checkCurrent: (state: ControlState) => {
      const isVisible = state.displayed
        .find(c => c.geoNameId === state.current?.geoNameId);

      state.current = isVisible
        ? state.current
        : state.displayed[0] || state.selected[0] || null;
    },
    sortTable: (
      state: ControlState, { payload }: PayloadAction<Sort | undefined>,
    ) => {
      if (payload !== undefined) {
        state.sortBy = payload === state.sortBy ? state.sortBy : payload;
        state.order = payload === state.sortBy ? !state.order : true;
      }

      const orderValue = state.order ? 1 : -1;

      switch (state.sortBy) {
        case Sort.byNames:
          state.displayed = [...state.displayed]
            .sort((a, b) => orderValue * a.name.localeCompare(b.name));
          break;

        case Sort.byMax:
          state.displayed = [...state.displayed].sort((a, b) => orderValue
              * (Number(a.weather?.dailyMax) - Number(b.weather?.dailyMax)));
          break;

        case Sort.byMin:
          state.displayed = [...state.displayed].sort((a, b) => orderValue
           * (Number(a.weather?.dailyMin) - Number(b.weather?.dailyMin)));
          break;

        default:
          state.displayed = [...state.displayed].sort((a, b) => orderValue
           * (Number(a.population) - Number(b.population)));
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
    // .addCase(getWeatherAsync.pending, (state: ControlState, { meta }) => {
    //   state.loadingList = [ ...state.loadingList, meta.arg.geoNameId];
    //   state.errors = state.errors.filter(e => e.id !== meta.arg.geoNameId);
    // })
    // .addCase(getWeatherAsync.fulfilled, (state, { meta, payload }) => {
    //   state.loadingList = state.loadingList.filter(c => c === meta.arg.geoNameId);
    //   state.displayed = state.displayed.map(c => c.geoNameId !== meta.arg.geoNameId
    //     ? c : payload);
    //   console.log(meta.arg.name, 'added');
    // })
    // .addCase(getWeatherAsync.rejected, (state, { payload, meta}) => {
    //   state.loadingList = state.loadingList.filter(c => c === meta.arg.geoNameId);
    //   state.errors = [ ...state.errors, ({ id: meta.arg.geoNameId, message: payload as string })];
    // })

      .addCase(getWeatherAsyncAll.pending, (
        state: ControlState,
      ) => {
        state.errors = initialState.errors;
        state.status = Status.pending;
      })
      .addCase(getWeatherAsyncAll.fulfilled, (state, { payload }) => {
        state.displayed = payload;
        state.status = Status.idle;
      })
      .addCase(getWeatherAsyncAll.rejected, (state, { payload }) => {
        const { detailedWithWeather, errors } = payload as RejectedPayload;

        state.displayed = detailedWithWeather || [];
        state.errors = errors || [];
        state.status = Status.idle;
      });
  },
});

export default controlSlice.reducer;
export const {
  saveKeys,
  changeDisplayed,
  addSelected,
  removeSelected,
  setCurrent,
  checkCurrent,
  sortTable,
  setDisplayed,
  resetState,
} = controlSlice.actions;

export const selectAllData = (state: RootState) => state.controls.allData;
export const selectAllKeys = (state: RootState) => state.controls.allKeys;

export const selectSelectedCountries
= (state: RootState) => state.controls.selectedCountries;
export const selectSelected = (state: RootState) => state.controls.selected;
export const selectDisplayed = (state: RootState) => state.controls.displayed;
export const selectCurrent = (state: RootState) => state.controls.current;
export const selectSortBy = (state: RootState) => state.controls.sortBy;
export const selectOrder = (state: RootState) => state.controls.order;
export const selectLoadingList
= (state: RootState) => state.controls.loadingList;
export const selectErrors = (state: RootState) => state.controls.errors;
export const selectStatus = (state: RootState) => state.controls.status;
