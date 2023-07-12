import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";

import { CityData } from "../../types/City";
import { City } from "../City";
import { WeatherData } from "../../types/Weather";
import { isExpired } from "../../utils/isExpired";

import './Table.scss';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addCashItem, selectCash } from "../../store/features/cash/cashSlice";
import { checkCurrent, selectCountry, selectOrder, selectSelected, selectSortBy } from "../../store/features/controls/controlsSlice";
import { Sort } from "../../types/Sort";

interface TableProps {
  onClickSelectHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityData, isSelected: boolean) => void;
  selectedCities: CityData[];
  onClickCurrentHandler: (city: CityData) => void;
  currentCity: CityData | null;
  className?: string;
}

export const Table:React.FC<TableProps> = ({
  selectedCities, 
  onClickSelectHandler, 
  onClickCurrentHandler, 
  currentCity,
  className,
}) => {
  
  const [displayed, setDisplayed] = useState<CityData[]>([]);
  const dispatch = useAppDispatch();
  const cash = useAppSelector(selectCash);
  const country = useAppSelector(selectCountry);
  const selected = useAppSelector(selectSelected);
  const sortBy = useAppSelector(selectSortBy);
  const order = useAppSelector(selectOrder);

  const sortTable = () => {
    const orderValue = order ? 1 : -1;
    switch (true) {
      case (sortBy === Sort.byNames):
        setDisplayed([...displayed].sort((a, b) => orderValue * a.name.localeCompare(b.name)));
        break;
  
      case (sortBy === Sort.byMax):
        setDisplayed([...displayed].sort((a, b) => orderValue * (Number(a.weather?.dailyMax) - Number(b.weather?.dailyMax))));
        break;
  
      case (sortBy === Sort.byMin):
        setDisplayed([...displayed].sort((a, b) => orderValue * (Number(a.weather?.dailyMin) - Number(b.weather?.dailyMin))));
        break;
  
      default:
        setDisplayed([...displayed].sort((a, b) => orderValue * (Number(a.population) - Number(b.population))));
    }
  };
  
  useEffect(() => {
    const loadWeather = async (city: CityData) => {
      if (city.geoNameId in cash && !isExpired(cash[city.geoNameId].timerId)) {
        // console.log(city.name, 'in cash!', 'isExpired:', isExpired(cash[city.geoNameId].timerId));
        
        return cash[city.geoNameId].city;
      }

      try {
        console.log( 'Loading data');

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

    country.length && 
    Promise.allSettled([...country, ...selected].map(c => loadWeather(c)))
      .then(results => {
        // console.log(results);

        const updatedCities = results.map(result => {
          if (result.status === "fulfilled") {
            if ((result.value.geoNameId in cash && isExpired(cash[result.value.geoNameId].timerId)) || !(result.value.geoNameId in cash)) {
              dispatch(addCashItem(result.value));
            }
            return result.value;
          } else {
            return result.reason as CityData;
          }
        });

        setDisplayed(updatedCities);
      }
    );  
  }, [cash, country, dispatch])

  useEffect(() => {
    dispatch(checkCurrent());
  }, [country])

  useEffect(() => {
    sortTable();
  }, [sortBy, order])

  useEffect(() => {
  }, [displayed])
  
  return (
    <table className={classNames("Table", className)}>
      <thead>
        <tr>
          <th>City</th>
          <th>Code</th>
          <th>Population</th>
          <th>Max Temp</th>
          <th>Min Temp</th>
          <th>Wind Direction</th>
        </tr>
      </thead>
      <tbody>
        {displayed.map((city) => (
          <City 
            key={city.geoNameId} 
            city={city} 
            onClickSelectHandler={onClickSelectHandler}
            selectedCities={selectedCities}
            onClickCurrentHandler={onClickCurrentHandler}
            currentCity={currentCity}
          />
        ))}
      </tbody>
    </table>
  )
};
