import axios from "axios";
import { CityData } from "../types/City";
import { WeatherData } from "../types/Weather";
import { isExpired } from "../utils/isExpired";
import { useAppSelector } from "../store/hooks";
import { selectCash } from "../store/features/cash/cashSlice";

export const useWeatherLoader = () => {
  const cash = useAppSelector(selectCash);

  const loadWeather = async (city: CityData) => {
    if (city.geoNameId in cash && !isExpired(cash[city.geoNameId].timerId)) {
      return cash[city.geoNameId].city;
    }

    try {
      const { data } = await axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`);

      const dailyMax = Math.max(...data.daily.temperature_2m_max);
      const dailyMin = Math.min(...data.daily.temperature_2m_min);
      const averageWind = Math.ceil(data.hourly.winddirection_10m.reduce((acc, el) => acc + el) / data.hourly.winddirection_10m.length);
      const daily_units = data.daily_units;

      return { ...city, weather: { dailyMax, dailyMin, averageWind, daily_units } } as CityData;
    } catch (error) {
      console.error(`Error during loading loadWeather ${city.name}`, error);
      return city;
    }
  };

  return loadWeather;
};
