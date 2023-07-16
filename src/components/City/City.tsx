import { FC, useEffect, useState } from "react";
import classnames from 'classnames';
import { CityData } from "../../types/City";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSelected, getWeatherAsync, removeSelected, selectCurrent,  selectErrors, selectLoadingList, selectSelected, setCurrent } from "../../store/features/controls/controlsSlice";
import './City.scss';
import { useNumberFormat } from "../../hooks/useNumberFormat";
import { Sort } from "../../types/Sort";
import { Td } from "../Td";
import { selectCash } from "../../store/features/cash/cashSlice";
import { ConditionalRenderer } from "../ConditionalRenderer";
import { WeatherAverage } from "../../types/Weather";

interface CityProps {
  city: CityData;
}

export const City:FC<CityProps> = ({
  city,
}) => {
  const [weather, setWeather] = useState<WeatherAverage | null | undefined>(null);
  const dispatch = useAppDispatch();
  const { name, population, countryCode } = city;
  const selected = useAppSelector(selectSelected);
  const isSelected = Boolean(selected.find(c => c.geoNameId === city.geoNameId));
  const isCurrent = useAppSelector(selectCurrent)?.geoNameId === city.geoNameId;

  const formatNumber = useNumberFormat();
  const cash = useAppSelector(selectCash);
  const isWeatherInCash = Boolean(city.geoNameId in cash && cash[city.geoNameId].city.weather);
  const isLoading = useAppSelector(selectLoadingList).includes(city.geoNameId);
  const error = useAppSelector(selectErrors).find(e => e.id === city.geoNameId)?.message;
  
  useEffect(() => {
    if (!city.weather && !isLoading && isWeatherInCash) {
        setWeather(cash[city.geoNameId].city.weather);
      } else {
        console.log(`${city.name} loading`);
        dispatch(getWeatherAsync(city));
      }
  }, [])

  const handleSelectCity = (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => {
    e.preventDefault();

    if (isSelected) {
      dispatch(removeSelected(city));
    } else {
      dispatch(addSelected(city));
    }
  };

  useEffect(() => {
    isWeatherInCash && setWeather(cash[city.geoNameId].city.weather);
  }, [isWeatherInCash])

  const handleSetCurrentCity = (city: CityData) => dispatch(setCurrent(city));

  const maxT = weather ? Math.round(+weather?.dailyMax) + ' ' +  weather?.daily_units?.temperature_2m_max : 'No data';
  const minT = weather ? Math.round(+weather?.dailyMin) + ' ' +  weather?.daily_units?.temperature_2m_min : 'No data';
  const averageWind = weather ? weather?.averageWind : 'No data';

  return (
    <tr 
      className={classnames('City',
        { 'City--selected': isSelected }, 
        { 'City--current': isCurrent },
        )}
      onClick={() => handleSetCurrentCity(city)}
      onContextMenu={(e) => handleSelectCity(e, city, isSelected)}
    >
      <Td type={Sort.byNames}>{name}</Td>
      <Td>{countryCode}</Td>
      <Td type={Sort.byPopulation}>{formatNumber(population)}</Td>
      <Td type={Sort.byMax}><ConditionalRenderer child={maxT} isLoading={isLoading} error={error} /></Td>
      <Td type={Sort.byMin}><ConditionalRenderer child={minT} isLoading={isLoading} error={error} /></Td>
      <Td><ConditionalRenderer child={averageWind} isLoading={isLoading} error={error} /></Td>
    </tr>
  )
};
