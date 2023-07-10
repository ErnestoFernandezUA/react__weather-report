import { FC, useEffect, useState } from "react";
import { CityFullData } from "../../types/City";
import axios from "axios";
import classnames from 'classnames';
import { WeatherData } from "../../types/Weather";

import './City.scss';

interface CityProps {
  city: CityFullData;
  selectedCities: CityFullData[];
  onClickSelectHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityFullData, isSelected: boolean) => void;
  onClickCurrentHandler: (city: CityFullData) => void;
}

export const City:FC<CityProps> = ({ city, onClickSelectHandler, selectedCities, onClickCurrentHandler }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeatherReport = async () => {
      try {
        console.log(city);

        const response = await axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`);

        setWeather(response.data);
      } catch (error) {
        console.error(`Error during loading loadWeatherReport ${city.name}`, error);
      }
    };

    loadWeatherReport();
  }, [city])

  useEffect(() => {

  }, [weather, selectedCities])

  const isSelected: boolean = Boolean(selectedCities.find(c => c.geoNameId === city.geoNameId));
  const AverageWind = weather && Math.ceil(weather?.hourly.winddirection_10m.reduce((acc, el) => acc + el) / weather?.hourly.winddirection_10m.length);

  return (
    <tr 
      className={classnames('City', { 'City--selected': isSelected })}
      onClick={() => onClickCurrentHandler(city)}
      onContextMenu={(e) => onClickSelectHandler(e, city, isSelected)}
    >
      <td>{city.name}</td>
      <td>{city.population}</td>
      <td>{weather?.daily.temperature_2m_min} {weather?.daily_units.temperature_2m_min}</td>
      <td>{weather?.daily.temperature_2m_max} {weather?.daily_units.temperature_2m_max}</td>
      <td>{AverageWind}</td>
    </tr>
  )
};