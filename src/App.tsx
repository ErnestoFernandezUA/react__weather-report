import { MouseEvent, useEffect, useState } from 'react';
import axios from 'axios';
import * as convert from 'xml-js';
import { Country, CountryXML } from './types/Country';

import './App.css';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await axios.get('https://cors-anywhere.herokuapp.com/http://api.geonames.org/countryInfo?username=efernandez', { responseType: 'text' });
        const result = convert.xml2js(response.data, { compact: true }) as CountryXML;
        
        const data: Country[] = result.geonames.country.map((el) => ({
          countryName: el.countryName._text,
          countryCode: el.countryCode._text,
        }));
        
        console.log('data = ', data.sort((a, b) => a.countryName.localeCompare(b.countryName)));
        setCountries(data);
      } catch (error) {
        setLoadError(error as Error);
      }
    };
    
    loadCountries();
  }, []);


  const loadCities = async (countryCode: string) => {
    try {
      const response = await axios.get(`http://api.geonames.org/searchJSON?username=efernandez&country=${countryCode}&maxRows=1000&style=SHORT`);

      console.log(response);

    } catch (error) {
      setLoadError(error as Error);
    }
  };

  const onChangeHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log('onChangeHandler');
    loadCities(e.currentTarget.value);
  };

  useEffect(() => {
    if (loadError) {
      console.log(loadError);
    }
  }, [loadError])

   return (
    <div className="App">
      <h1>Weather report</h1>

      <select 
        name="countries" 
        id="countries"
        onChange={(e) => onChangeHandler(e)}
      >
        {countries.map(el => 
          <option 
            key={el.countryName}
            value={el.countryCode}
          >
            {el.countryName}
        </option>)}
      </select>
    </div>
  );
}

export default App;