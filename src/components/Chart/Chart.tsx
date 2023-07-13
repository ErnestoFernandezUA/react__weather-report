import { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { WeatherData } from "../../types/Weather";
import { useAppSelector } from "../../store/hooks";
import { selectCurrent } from "../../store/features/controls/controlsSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { WrapperContent } from "../WrapperContent";

import './Chart.scss';

interface Average {
  day: number,
  value: number,
  month: number,
  year: number,
}
interface ChartProps {
  className?: string;
}

export const Chart: FC<ChartProps> = ({ className }) => {
  const current = useAppSelector(selectCurrent);
  const [average, setAverage] = useState<Average[] | null>(null);
  const chartContentRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!current) return;

    axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${current.latitude}&longitude=${current.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`)
      .then(response => {
        const average = response.data.daily.time.map((dateString, index) => {
          const date = new Date(dateString);
          const dayOfMonth = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const value = Math.ceil((response.data.daily.temperature_2m_max[index] + response.data.daily.temperature_2m_min[index]) / 2 * 10) / 10;

          return { day: dayOfMonth, value, month, year };
        });

        setAverage(average);
      })
      .catch(error => console.error(`Error during loading loadWeatherReport ${current.name}`, error));
  }, [current])

  useEffect(() => {
    if(chartContentRef.current) {
      setWidth(chartContentRef.current.clientWidth);
    }
  }, [average, windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxYValue = average ? Math.ceil(Math.max(...average.map(a => a.value))) : 0;
  const widthBarChart = windowWidth > 1024 ? width * 0.8 - 30 : width - 30;

  return (
    <WrapperContent className={"Chart"}>
      <h2 className="Chart__title">{current ? current?.name : 'chose city...'}</h2>

      {average ? (
        <div className="Chart__content" ref={chartContentRef}>
          <BarChart
            width={widthBarChart} 
            height={widthBarChart * 0.6} 
            data={average}
            margin={{ top: 10, right: 0, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="2 2"
            />
            <XAxis 
              dataKey="day"  
              stroke="#8884d8"
              tick={{ fontSize: 10, fill: '#666' }} 
              padding={{ left: 10, right: 10 }}
              tickLine={{ stroke: '#8884d8' }}
              axisLine={{ stroke: '#8884d8' }}
            />
            <YAxis
              domain={[0, maxYValue * 1.3]} 
              tick={{ fontSize: 10, fill: '#666' }} 
              // padding={{ top: 20, bottom: 0 }}
              tickMargin={4}
              ticks={[10,20, 30, 40]}
              tickLine={{ stroke: '#8884d8' }}
              axisLine={{ stroke: '#8884d8' }}
            />
            <Tooltip
              // wrapperStyle={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
              // labelStyle={{ fontSize: 14, color: '#c41919' }} 
              // itemStyle={{ fontSize: 14, color: '#e01313' }}
              wrapperStyle={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}
              labelStyle={{ fontSize: 14, color: '#c41919' }} 
              itemStyle={{ fontSize: 14, color: '#e01313' }}
            />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      ) : null}
    </WrapperContent>
  )
};
