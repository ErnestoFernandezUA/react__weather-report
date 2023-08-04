import { FC } from 'react';
import classnames from 'classnames';

import { ConditionalRenderer } from '../ConditionalRenderer';
import { CityData } from '../../types/City';
import { Sort } from '../../types/Sort';
import { Td } from '../Td';
import { useNumberFormat } from '../../hooks/useNumberFormat';
import {
  addSelected,
  removeSelected,
  selectCurrent,
  selectErrors,
  selectLoadingList,
  selectSelected,
  setCurrent,
} from '../../store/features/controls/controlsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './City.scss';

interface CityProps {
  city: CityData;
}

export const City:FC<CityProps> = ({
  city,
}) => {
  const dispatch = useAppDispatch();
  const { name, population, countryCode } = city;
  const selected = useAppSelector(selectSelected);
  const isSelected = !!(selected.find(c => c.geoNameId === city.geoNameId));
  const isCurrent = useAppSelector(selectCurrent)?.geoNameId === city.geoNameId;

  const formatNumber = useNumberFormat();

  const isLoading = useAppSelector(selectLoadingList).includes(city.geoNameId);
  const error = useAppSelector(selectErrors)
    .find(e => e.id === city.geoNameId)?.message;

  const { weather } = city;

  const handleSelectCity = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    if (isSelected) {
      dispatch(removeSelected(city));
    } else {
      dispatch(addSelected(city));
    }
  };

  const handleSetCurrentCity = () => dispatch(setCurrent(city));

  const maxT = weather
    ? `${Math.round(+weather?.dailyMax)} ${weather?.daily_units?.temperature_2m_max}`
    : 'No data';
  const minT = weather
    ? `${Math.round(+weather?.dailyMin)} ${weather?.daily_units?.temperature_2m_min}`
    : 'No data';
  const averageWind = weather ? weather?.averageWind : 'No data';

  return (
    <tr
      className={classnames('City',
        { 'City--selected': isSelected },
        { 'City--current': isCurrent })}
      onClick={handleSetCurrentCity}
      onContextMenu={handleSelectCity}
    >
      <Td type={Sort.byNames}>{name}</Td>
      <Td>{countryCode}</Td>
      <Td type={Sort.byPopulation}>{formatNumber(population)}</Td>
      <Td type={Sort.byMax}>
        <ConditionalRenderer isLoading={isLoading} error={error}>
          {maxT}
        </ConditionalRenderer>
      </Td>

      <Td type={Sort.byMin}>
        <ConditionalRenderer isLoading={isLoading} error={error}>
          {minT}
        </ConditionalRenderer>
      </Td>

      <Td>
        <ConditionalRenderer isLoading={isLoading} error={error}>
          {averageWind}
        </ConditionalRenderer>
      </Td>
    </tr>
  );
};
