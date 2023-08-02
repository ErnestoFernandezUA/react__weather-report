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
import './Chart.scss';

interface Average {
  value: number,
  day: number,
  month: number,
  year: number,
}
interface ChartProps {
  className?: string;
}

export const Chart: FC<ChartProps> = ({ className }) => {
  const current = useAppSelector(selectCurrent);
  const displayed = useAppSelector(selectDisplayed);
  const [average, setAverage] = useState<Average[]>([]);

  const [temperatureStep, setTemperatureStep] = useState<1 | 5 | 10>(1);
  const [maxYValue, setMaxYValue] = useState(0);
  const [verticalAxe, setVerticalAxe] = useState<number[]>([]);

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

        const max = Math.abs(Math.max(...newAverage.map(el => el.value)));
        const min = Math.abs(Math.min(...newAverage.map(el => el.value)));

        setMaxYValue(newAverage
          ? Math.ceil(Math.ceil(Math.max(...newAverage.map(a => a.value)))
            / 5) * 5
          : 0);

        if (max > 20 || min > 20) {
          setTemperatureStep(10);
        } else if (max > 10 || min > 10) {
          setTemperatureStep(5);
        }
      })
      // eslint-disable-next-line no-console
      .catch(error => console.error(`Error during loading loadWeatherReport ${current.name}`, error));
  }, [current]);

  useEffect(() => {
    if (!displayed.length) {
      setAverage([]);
    }
  }, [displayed]);

  useEffect(() => {
    const max = Math.max(...average.map(el => el.value));
    const min = Math.min(...average.map(el => el.value));

    let start = min < 0 ? min - (min % temperatureStep) - temperatureStep : 0;
    const newVerticalAxe = [];

    while (start < max + temperatureStep) {
      newVerticalAxe.push(start);
      start += temperatureStep;
    }

    setVerticalAxe(newVerticalAxe);
  }, [temperatureStep]);

  return (
    <WrapperContent className={classNames('Chart', className)}>
      <h2 className="Chart__title">
        {current ? current?.name : 'chose city...'}
      </h2>

      {!!average.length && (
        <div className="Chart">
          <div className="Chart__container">
            <div className="Chart__vertical-axe">
              {verticalAxe.map(value => (
                <div key={value} className="Chart__vertical-axe-value">
                  {value}
                  <div className="Chart__line" />
                </div>
              ))}
            </div>

            <div className="Chart__columns">
              {average.map(el => (
                <div
                  key={el.day}
                  className="Chart__column"
                >
                  <div
                    className="Chart__tower"
                    style={{ height: `${Math.floor((el.value * 200) / maxYValue)}px` }}
                  >
                    <div
                      className="Chart__value"
                      style={{ top: `${Math.floor((el.value * 100) / maxYValue / 2)}%` }}
                    >
                      {`${el.value}°C`}
                    </div>
                  </div>
                  <p className="Chart__day">
                    {el.day}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </WrapperContent>
  );
};
