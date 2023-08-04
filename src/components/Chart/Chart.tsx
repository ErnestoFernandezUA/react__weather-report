import {
  FC, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { WrapperContent } from '../WrapperContent';
import './Chart.scss';

export interface Average {
  value: number,
  day: number,
  month: number,
  year: number,
}
interface ChartProps {
  average: Average[];
  className?: string;
  heightChart?: number;
}

export const Chart: FC<ChartProps> = ({
  className,
  average,
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
    const maxValue = Math.max(...average.map(el => el.value));
    const minValue = Math.min(...average.map(el => el.value));
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
  }, [average]);

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
      {!!average.length && (
        <div className="Chart">
          <div
            className="Chart__container"
            style={{ height: `${heightContainer + paddingContainer * 2}px` }}
          >
            <div className="Chart__vertical-axe">
              {labelsVerticalAxe.map(v => (
                <div
                  key={v}
                  className={classNames('Chart__vertical-axe-item',
                    { 'Chart__vertical-axe-item--highlight': isHighLight(v) })}
                  style={styleVerticalAxeItem(v)}
                >
                  <div className="Chart__vertical-axe-label">{v}</div>
                  <div className="Chart__vertical-axe-line" />
                </div>
              ))}
            </div>

            <div className="Chart__horizontalAxe">
              {average.map(el => (
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
          </div>
        </div>
      )}
    </WrapperContent>
  );
};
