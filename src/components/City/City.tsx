import { FC, useEffect } from "react";
import classnames from 'classnames';
import { CityData } from "../../types/City";

import './City.scss';

interface CityProps {
  city: CityData;
  selectedCities: CityData[];
  onClickSelectHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => void;
  onClickCurrentHandler: (city: CityData) => void;
  currentCity: CityData | null;
}

export const City:FC<CityProps> = ({
  city,
  onClickSelectHandler,
  selectedCities,
  onClickCurrentHandler,
  currentCity,
}) => {
  const { name, population, weather, countryCode } = city;

  useEffect(() => {
    // console.log('render', city, city.weather);
  }, [city, selectedCities])

  const isSelected: boolean = Boolean(selectedCities.find(c => c.geoNameId === city.geoNameId));
  const isCurrent = currentCity?.geoNameId === city.geoNameId;
  const maxT = weather ? weather?.dailyMax + ' ' +  weather?.daily_units?.temperature_2m_max : 'No data';
  const minT = weather ? weather?.dailyMin + ' ' +  weather?.daily_units?.temperature_2m_min : 'No data';
  const averageWind = weather ? weather?.averageWind : 'No data';

  return (
    <tr 
      className={classnames('City',
        { 'City--selected': isSelected }, 
        { 'City--current': isCurrent },
        )}
      onClick={() => onClickCurrentHandler(city)}
      onContextMenu={(e) => onClickSelectHandler(e, city, isSelected)}
    >
      <td>{name}</td>
      <td>{countryCode}</td>
      <td>{population}</td>
      <td>{maxT} </td>
      <td>{minT}</td>
      <td>{averageWind}</td>
    </tr>
  )
};