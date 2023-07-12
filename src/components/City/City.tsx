import { FC, useEffect } from "react";
import classnames from 'classnames';
import { CityData } from "../../types/City";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSelected, removeSelected, selectCurrent, selectSelected, setCurrent } from "../../store/features/controls/controlsSlice";
import './City.scss';
import { useNumberFormat } from "../../hooks/useNumberFormat";

interface CityProps {
  city: CityData;
}

export const City:FC<CityProps> = ({
  city,
}) => {
  const dispatch = useAppDispatch();
  const { name, population, weather, countryCode } = city;
  const selected = useAppSelector(selectSelected);
  const isSelected: boolean = Boolean(selected.find(c => c.geoNameId === city.geoNameId));
  const isCurrent = useAppSelector(selectCurrent)?.geoNameId === city.geoNameId;
  const maxT = weather ? weather?.dailyMax + ' ' +  weather?.daily_units?.temperature_2m_max : 'No data';
  const minT = weather ? weather?.dailyMin + ' ' +  weather?.daily_units?.temperature_2m_min : 'No data';
  const averageWind = weather ? weather?.averageWind : 'No data';
  const formatNumber = useNumberFormat();

  useEffect(() => {
  }, [city, selected])

  const handleSelectCity = (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => {
    e.preventDefault();

    if (isSelected) {
      dispatch(removeSelected(city));
    } else {
      dispatch(addSelected(city));
    }
  };

  const handleSetCurrentCity = (city: CityData) => dispatch(setCurrent(city));

  return (
    <tr 
      className={classnames('City',
        { 'City--selected': isSelected }, 
        { 'City--current': isCurrent },
        )}
      onClick={() => handleSetCurrentCity(city)}
      onContextMenu={(e) => handleSelectCity(e, city, isSelected)}
    >
      <td>{name}</td>
      <td>{countryCode}</td>
      <td>{formatNumber(population)}</td>
      <td>{maxT} </td>
      <td>{minT}</td>
      <td>{averageWind}</td>
    </tr>
  )
};
