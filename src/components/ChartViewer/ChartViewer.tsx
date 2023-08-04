import {
  FC, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { useAppSelector } from '../../store/hooks';
import {
  selectCurrent,
  selectDisplayed,
} from '../../store/features/controls/controlsSlice';
import { WrapperContent } from '../WrapperContent';
import { getWeekWR } from '../../api/weather';
import './ChartViewer.scss';
import { Average, Chart } from '../Chart/Chart';

interface ChartViewerProps {
  className?: string;
}

export const ChartViewer: FC<ChartViewerProps> = ({ className }) => {
  const current = useAppSelector(selectCurrent);
  const displayed = useAppSelector(selectDisplayed);
  const [average, setAverage] = useState<Average[]>([]);

  useEffect(() => {
    if (!current) {
      return;
    }

    getWeekWR(current)
      .then(res => {
        const newAverage = res.daily.time.map((dateString, index) => {
          const date = new Date(dateString);
          const dayOfMonth = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const value = Math.ceil(((res.daily.temperature_2m_max[index]
            + res.daily.temperature_2m_min[index]) / 2) * 10) / 10;

          return {
            day: dayOfMonth, value, month, year,
          };
        });

        setAverage(newAverage);
      })
      // eslint-disable-next-line no-console
      .catch(error => console.error(`Error during loading loadWeatherReport ${current.name}`, error));
  }, [current]);

  useEffect(() => {
    if (!displayed.length) {
      setAverage([]);
    }
  }, [displayed]);

  return (
    <WrapperContent className={classNames('ChartViewer', className)}>
      <h2 className="ChartViewer__title">
        {current ? current?.name : 'chose city...'}
      </h2>

      <Chart average={average} />
    </WrapperContent>
  );
};
