import { useEffect, useState } from 'react';
import { CityData } from './types/City';
import { Table } from './components/Table/Table';
import data from './data/data.json';
import { Chart } from './components/Chart';
import './App.scss';
import { Filter } from './types/Filter';

function App() {
  const [allData, setAllData] = useState<{ [key: string]: CityData[]} | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);

// const { addCashCity, getCashCity, removeCashCity } = useCash();
  const [country, setCountry] = useState<CityData[]>([]);
  const [selected, setSelected] = useState <CityData[]>([]);
  const [current, setCurrent] = useState <CityData | null>(null);

  // const [filterSelected, setFilterSelected] = useState<Filter>(Filter.byPopulation);

  useEffect(() => {   
    setAllData(data.data);
    setKeys(data.keys);
  }, [])

  useEffect(() => {   
    if (country.find(c => c.geoNameId === current?.geoNameId) || selected.find(c => c.geoNameId === current?.geoNameId )) {
      setCurrent(country[0] || selected[0]);
    }
  }, [country])

  const addCityToCountry = (city: CityData) => {
    setCountry([ ...country, city ]);
  };

  const removeCityFromCountry = (city: CityData) => {
    setCountry(country.filter(c => c.geoNameId !== city.geoNameId));
  };

  const addCityToSelected = (city: CityData) => {
    setSelected(selected => [ ...selected, city ]);
  };

  const removeCityFromSelected = (city: CityData) => {
    setSelected(selected => selected.filter(c => c.geoNameId !== city.geoNameId));
  };

  const onChangeCountryHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log('onChangeCountryHandler');

    if (allData && e.currentTarget.value in allData) {
      if (selected.length) {
        const selectedCitiesGeoNameId = selected.map(c => c.geoNameId);

        setCountry(allData[e.currentTarget.value].filter(c => !selectedCitiesGeoNameId.includes(c.geoNameId)));
      } else {
        setCountry(allData[e.currentTarget.value]);
      }
    }
  };

  const onClickSelectHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => {
    e.preventDefault();
    console.log('onClickSelectHandler');

    if (isSelected) {
      removeCityFromSelected(city);
      addCityToCountry(city);
    } else {
      removeCityFromCountry(city);
      addCityToSelected(city);
    }
  };

  const onClickCurrentHandler = (city: CityData) => {
    setCurrent(current => current?.geoNameId !== city.geoNameId ? city : null);
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
            cities={[ ...country, ...selected ]} 
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
