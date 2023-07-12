import { useEffect, useState } from 'react';
import { CityData } from './types/City';
import { Table } from './components/Table/Table';
import data from './data/data.json';
import { Chart } from './components/Chart';
import './App.scss';
import { Sort } from './types/Sort';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { addChosenCountry, addSelected, removeSelected, selectCountry, selectCurrent, selectSelected, setCurrent, sort } from './store/features/controls/controlsSlice';

function App() {
  const [allData, setAllData] = useState<{ [key: string]: CityData[]} | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);

  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelected);
  const current = useAppSelector(selectCurrent)

  useEffect(() => {   
    setAllData(data.data);
    setKeys(data.keys);
  }, [])

  useEffect(() => {   
    allData && dispatch(addChosenCountry(allData[data.keys[0].value]));
  }, [allData])

  const onChangeCountryHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    if (allData && e.currentTarget.value in allData) {
      dispatch(addChosenCountry(allData[e.currentTarget.value]));
    }
  };

  const onClickSelectHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => {
    e.preventDefault();
    console.log('onClickSelectHandler');

    if (isSelected) {
      dispatch(removeSelected(city));
    } else {
      dispatch(addSelected(city));
    }
  };

  const onClickCurrentHandler = (city: CityData) => dispatch(setCurrent(city));
  const onClickPopulation = () => dispatch(sort(Sort.byPopulation));
  const onClickName = () => dispatch(sort(Sort.byNames));
  const onClickMax = () => dispatch(sort(Sort.byMax));
  const onClickMin = () => dispatch(sort(Sort.byMin));

  return (
    <div className="App">
      <header>
        <h1>Weather report</h1>
        {/* <h2>Selected cities: {selectedCities.length}</h2> */}
        <div className="App__controls">
          <button onClick={onClickPopulation}>byPopulation</button>
          <button onClick={onClickName}>byName</button>
          <button onClick={onClickMax}>byMax</button>
          <button onClick={onClickMin}>byMin</button>

          <label htmlFor="countries">
            <select 
              name="countries" 
              id="countries"
              onChange={(e) => onChangeCountryHandler(e)}
              defaultValue={keys?.length && keys[0].value}
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
        </div>
      </header>

      <main>
        <div className="App__chart">
          {current && <Chart city={current} />}
        </div>

        <div className="App__table">
          

          <Table 
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
