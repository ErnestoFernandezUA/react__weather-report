import { FC, useEffect, useState } from "react";
import axios from "axios";
import { WeatherData } from "../../types/Weather";
import { useAppSelector } from "../../store/hooks";
import { selectCurrent } from "../../store/features/controls/controlsSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import './Chart.scss';
import { useWidthContent } from "../../hooks/useWidthContent";

interface ChartProps {
  className?: string;
}

export const Chart: FC<ChartProps> = ({ className }) => {
  const current = useAppSelector(selectCurrent);
  const [average, setAverage] = useState<{ date: number; value: number }[] | null>(null);
const { widthChart } = useWidthContent(); 

  useEffect(() => {
    if (!current) return;

    axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${current.latitude}&longitude=${current.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`)
      .then(response => {
        const average = response.data.daily.time.map((dateString, index) => {
          const date = new Date(dateString);
          const dayOfMonth = date.getDate();
          const value = Math.ceil((response.data.daily.temperature_2m_max[index] + response.data.daily.temperature_2m_min[index]) / 2 * 10) / 10;

          return { date: dayOfMonth, value };
        });

        setAverage(average);
      })
      .catch(error => console.error(`Error during loading loadWeatherReport ${current.name}`, error));
  }, [current])

  const maxYValue = average ? Math.ceil(Math.max(...average.map(a => a.value))) : 0;

  console.log('widthChart', widthChart, maxYValue);

  return (
    <div className={className}>
      {current ? <h2>{current?.name}</h2> : null}
      {average ? (
        <div className="Chart">
          <BarChart
            width={widthChart - 40} 
            height={widthChart * 0.6} 
            data={average}
            margin={{ top: 10, right: 0, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="2 2"
            />
            <XAxis 
              dataKey="date"  
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
    </div>
  )
};
