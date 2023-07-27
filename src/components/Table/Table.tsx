import { useEffect } from 'react';
import classNames from 'classnames';
import { City } from '../City';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  Status,
  checkCurrent,
  getWeatherAsyncAll,
  selectDisplayed,
  selectSelectedCountries,
  selectStatus,
} from '../../store/features/controls/controlsSlice';
import { Sort } from '../../types/Sort';
import { HeadCell } from '../HeadCell';
import './Table.scss';
import { Loader } from '../Loader';

interface TableProps {
  className?: string;
}

export const Table: React.FC<TableProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const displayed = useAppSelector(selectDisplayed);
  const selectedCountries = useAppSelector(selectSelectedCountries);
  const isLoading = useAppSelector(selectStatus) === Status.pending;

  useEffect(() => {
    dispatch(checkCurrent());
  }, [displayed]);

  useEffect(() => {
    dispatch(getWeatherAsyncAll());
  }, [selectedCountries]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <table className={classNames('Table', className)}>
      <thead>
        <tr>
          <HeadCell type={Sort.byNames} />
          <HeadCell title="Code" />
          <HeadCell type={Sort.byPopulation} />
          <HeadCell type={Sort.byMax} />
          <HeadCell type={Sort.byMin} />
          <HeadCell title="Wind Direction" />
        </tr>
      </thead>

      <tbody>
        {displayed.map(city => <City key={city.geoNameId} city={city} />)}
      </tbody>
    </table>
  );
};
