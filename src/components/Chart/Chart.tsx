import { FC, useEffect, useState } from "react";
import { CityData } from "../../types/City";
import axios from "axios";
import { WeatherData } from "../../types/Weather";

import './Chart.scss';

interface ChartProps {
  city: CityData;
}

export const Chart:FC<ChartProps> = ({ city }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [average, setAverage] = useState<{ date: string; value: number }[] | null>(null);

  useEffect(() => {
    const loadWeatherReport = async () => {
      try {
        const response = await axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`);

        setWeather(response.data);
      } catch (error) {
        console.error(`Error during loading loadWeatherReport ${city.name}`, error);
      }
    };

    loadWeatherReport();
  }, [city])

  useEffect(() => {
    const average = weather?.daily.time.map((date, index) => ({
      date,
      value: Math.ceil((weather.daily.temperature_2m_max[index] + weather.daily.temperature_2m_min[index]) / 2 * 10) / 10, 
    }))

    average && setAverage(average);
  }, [weather])

  return (
    <div className="Chart">
      {city.name}
      {average?.map(el => (
        <div key={el.date}>
          {el.date} - {el.value}
        </div>
      ))}
    </div>
  )
};