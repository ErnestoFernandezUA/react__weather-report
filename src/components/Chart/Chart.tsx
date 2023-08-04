import {
  FC, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { WrapperContent } from '../WrapperContent';
import './Chart.scss';
import { ConditionalRenderer } from '../ConditionalRenderer';

export interface Average {
  value: number,
  day: number,
  month: number,
  year: number,
}
interface ChartProps {
  data: Average[];
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  heightChart?: number;
}

export const Chart: FC<ChartProps> = ({
  className,
  data,
  isLoading = false,
  error = '',
  heightChart = 240,
}) => {
  const [labelsVerticalAxe, setLabelsVerticalAxe] = useState<number[]>([]);
  const [height, setHeight] = useState<number>(1);
  const [delta, setDelta] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const paddingContainer = 20;
  const heightContainer = heightChart - 2 * paddingContainer;

  useEffect(() => {
    const maxValue = Math.max(...data.map(el => el.value));
    const minValue = Math.min(...data.map(el => el.value));
    let newStep = 1;

    if (Math.abs(maxValue) > 30 || Math.abs(minValue) > 30) {
      newStep = 10;
    } else if (Math.abs(maxValue) > 10 || Math.abs(minValue) > 10) {
      newStep = 5;
    }

    const newLabels = [];

    const max = maxValue >= 0
      ? maxValue - (maxValue % newStep) + newStep
      : 0;

    const min = minValue <= 0
      ? minValue - (minValue % newStep) - newStep
      : 0;

    for (let i = min; i <= max; i += newStep) {
      newLabels.push(i);
    }

    const newHight = (heightContainer / (newLabels.length - 1))
    / newStep;

    const newDelta = max * newHight;

    setStep(newStep);
    setLabelsVerticalAxe(newLabels);
    setHeight(newHight);
    setDelta(newDelta);
  }, [data]);

  const styleVerticalAxeItem = (v: number) => ({
    top: `${delta - v * height}px`,
  });

  const styleTower = (value: number) => ({
    height: `${Math.abs(value * height)}px`,
    top: `${value > 0
      ? -heightContainer - paddingContainer + delta
      : -value * height - heightContainer - paddingContainer + delta}px`,
  });

  const isHighLight = (v: number) => hoverValue !== null
  && Math.abs(v - hoverValue) < step;

  return (
    <WrapperContent className={classNames(className)}>
      {!!data.length && (
        <div className="Chart">
          <div
            className="Chart__container"
            style={{ height: `${heightContainer + paddingContainer * 2}px` }}
          >
            <ConditionalRenderer isLoading={isLoading} error={error}>
              <div className="Chart__axeY">
                {labelsVerticalAxe.map(v => (
                  <div
                    key={v}
                    className={classNames('Chart__axeY-item',
                      { 'Chart__axeY-item--highlight': isHighLight(v) })}
                    style={styleVerticalAxeItem(v)}
                  >
                    <div className="Chart__axeY-label">{v}</div>
                    <div className="Chart__axeY-line" />
                  </div>
                ))}
              </div>

              <div className="Chart__axeX">
                {data.map(el => (
                  <div
                    key={el.day}
                    className="Chart__column"
                    onMouseEnter={() => setHoverValue(el.value)}
                    onMouseLeave={() => setHoverValue(null)}
                  >
                    <div
                      className={classNames('Chart__tower',
                        { 'Chart__tower--up': el.value > 0 },
                        { 'Chart__tower--down': el.value < 0 })}
                      style={styleTower(el.value)}
                    >
                      &nbsp;
                    </div>

                    <div
                      className="Chart__tower-value"
                      style={{
                        top: `${-heightContainer + delta
                          - (el.value * height) / 2}px`,
                      }}
                    >
                      {`${el.value}°C`}
                    </div>

                    <div className="Chart__horizon-axe-label">
                      {el.day}
                    </div>
                  </div>
                ))}
              </div>
            </ConditionalRenderer>
          </div>
        </div>
      )}
    </WrapperContent>
  );
};
