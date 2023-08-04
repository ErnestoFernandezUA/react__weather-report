import {
  FC, useEffect,
} from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  Status,
  clearWeekWeather,
  getWeekWeatherAsync,
  selectCurrent,
  selectDisplayed,
  selectErrorWeekWeather,
  selectStatusWeekWeather,
  selectWeekWeather,
} from '../../store/features/controls/controlsSlice';
import { WrapperContent } from '../WrapperContent';
import './ChartViewer.scss';
import { Chart } from '../Chart/Chart';
import { ConditionalRenderer } from '../ConditionalRenderer';

interface ChartViewerProps {
  className?: string;
}

export const ChartViewer: FC<ChartViewerProps> = ({ className }) => {
  const current = useAppSelector(selectCurrent);
  const displayed = useAppSelector(selectDisplayed);
  const dispatch = useAppDispatch();
  const weekWeather = useAppSelector(selectWeekWeather);
  const isLoading = useAppSelector(selectStatusWeekWeather) === Status.pending;
  const error = useAppSelector(selectErrorWeekWeather);

  useEffect(() => {
    if (!current) {
      return;
    }

    dispatch(getWeekWeatherAsync(current));
  }, [current]);

  useEffect(() => {
    if (!displayed.length) {
      dispatch(clearWeekWeather());
    }
  }, [displayed]);

  return (
    <WrapperContent className={classNames('ChartViewer', className)}>
      <h2 className="ChartViewer__title">
        {current ? current?.name : 'chose city...'}
      </h2>

      <ConditionalRenderer isLoading={isLoading} error={error}>
        <Chart average={weekWeather} />
      </ConditionalRenderer>
    </WrapperContent>
  );
};
