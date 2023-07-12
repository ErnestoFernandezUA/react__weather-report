import { FC, useEffect, useState } from "react";
import axios from "axios";
import { WeatherData } from "../../types/Weather";
import { useAppSelector } from "../../store/hooks";
import { selectCurrent } from "../../store/features/controls/controlsSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import './Chart.scss';

interface ChartProps {
  className?: string;
}

export const Chart: FC<ChartProps> = ({ className }) => {
  const current = useAppSelector(selectCurrent);
  const [average, setAverage] = useState<{ date: number; value: number }[] | null>(null);

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

  const maxYValue = average ? Math.max(...average.map(a => a.value)) : 0;

  return (
    <div className={`Chart ${className}`}>
      {current?.name}
      {average ? (
        <BarChart width={500} height={300} data={average}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, maxYValue * 1.3]} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      ) : null}
    </div>
  )
};
