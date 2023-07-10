import { useEffect, useState } from 'react';
import { CityFullData } from './types/City';
import { Table } from './components/Table/Table';
import data from './data/data.json';
import './App.css';

function App() {
  const [countries, setCountries] = useState<{ [key: string]: CityFullData[]} | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);
  const [country, setCountry] = useState<CityFullData[] | null>(null);
  const [selectedCities, setSelectedCities] = useState <CityFullData[]>([]);
  const [currentCity, setCurrentCity] = useState <CityFullData | null>(null);

  useEffect(() => {   
    setCountries(data.data);
    setKeys(data.keys);
  }, [])

  const onChangeCountryHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    if (countries && e.currentTarget.value in countries) {
      setCountry(countries[e.currentTarget.value]);
    }
  };

  const onClickSelectHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityFullData, isSelected: boolean) => {
    e.preventDefault();
    console.log('onClickSelectHandler');

    if (isSelected) {
      setSelectedCities(selectedCities => selectedCities.filter(c => c.geoNameId !== city.geoNameId));
    } else {
      setSelectedCities(selectedCities => [ ...selectedCities, city ]);
    }
  };

  const onClickCurrentHandler = (city: CityFullData) => {
    console.log('onClickCurrentHandler');

    setCurrentCity(city);
  };

  if (!keys || !countries) {
    return (
      <div>
        <h1>data loading...</h1>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Weather report</h1>
      <h2>Selected cities: {selectedCities.length}</h2>

      <div className="App_chart">
        {currentCity?.name}
      </div>

      <div className="App__table">
        <label htmlFor="countries">
          <select 
            name="countries" 
            id="countries"
            onChange={(e) => onChangeCountryHandler(e)}
          >
            {keys.map(el => 
              <option 
                key={el.value}
                value={el.value}
              >
                {el.label}
            </option>)}
          </select>
        </label>

        <Table 
          country={country} 
          onClickSelectHandler={onClickSelectHandler}
          onClickCurrentHandler={onClickCurrentHandler}
          selectedCities={selectedCities}
        />
      </div>
    </div>
  );
}

export default App;
