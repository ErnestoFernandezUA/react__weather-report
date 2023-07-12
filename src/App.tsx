import { useEffect, useState } from 'react';
import { CityData } from './types/City';
import { Table } from './components/Table/Table';
import data from './data/data.json';
import { Chart } from './components/Chart';
import './App.scss';
import { Filter } from './types/Filter';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { addChosenCountry, addSelected, removeSelected, selectCountry, selectCurrent, selectSelected, setCurrent } from './store/features/controls/controlsSlice';

function App() {
  const [allData, setAllData] = useState<{ [key: string]: CityData[]} | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);

  const dispatch = useAppDispatch();
  const country = useAppSelector(selectCountry);
  const selected = useAppSelector(selectSelected);
  const current = useAppSelector(selectCurrent)
  // const [current, setCurrent] = useState <CityData | null>(null);

  // const [filterSelected, setFilterSelected] = useState<Filter>(Filter.byPopulation);

  useEffect(() => {   
    setAllData(data.data);
    setKeys(data.keys);
  }, [])

  useEffect(() => {   
    // if (country.find(c => c.geoNameId === current?.geoNameId) || selected.find(c => c.geoNameId === current?.geoNameId )) {
    //   setCurrent(country[0] || selected[0]);
    // }
    dispatch(setCurrent(current));
  }, [country])

  const onChangeCountryHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    if (allData && e.currentTarget.value in allData) {
      dispatch(addChosenCountry(allData[e.currentTarget.value]));
    }
  };

  const onClickSelectHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => {
    e.preventDefault();
    console.log('onClickSelectHandler');

    if (isSelected) {
      dispatch(addSelected(city));
    } else {
      dispatch(removeSelected(city));
    }
  };

  const onClickCurrentHandler = (city: CityData) => {
    dispatch(setCurrent(city));
  };

  // const filter = () => {
    
  //   switch (true) {
  //     case filterSelected === Filter.byMAX:
  //       setSelectedCities(selectedCities => selectedCities.sort((a, b) => {
  //         if (!a.weather) {
  //           return -1;
  //         }

  //         if (!b.weather) {
  //           return 1;
  //         }

  //         return b.weather.localeCompare(a.name)
  //       }));
  //   }
  // };

  return (
    <div className="App">
      <header>
        <h1>Weather report</h1>
        {/* <h2>Selected cities: {selectedCities.length}</h2> */}
      </header>

      <main>
        <div className="App__chart">
          {current && <Chart city={current} />}
        </div>

        <div className="App__table">
          <label htmlFor="countries">
            <select 
              name="countries" 
              id="countries"
              onChange={(e) => onChangeCountryHandler(e)}
            >
              {keys && keys.map(el => 
                <option 
                  key={el.value}
                  value={el.value}
                >
                  {el.label}
              </option>)}
            </select>
          </label>

          <Table 
            // cities={[ ...country, ...selected ]} 
            onClickSelectHandler={onClickSelectHandler}
            onClickCurrentHandler={onClickCurrentHandler}
            selectedCities={selected}
            currentCity={current}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
