import { useEffect, useState } from "react";
import classNames from "classnames";

import { CityData } from "../../types/City";
import { City } from "../City";
import { isExpired } from "../../utils/isExpired";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addCashItem, selectCash } from "../../store/features/cash/cashSlice";
import { addSelected, checkCurrent, removeSelected, selectCountry, selectCurrent, selectOrder, selectSelected, selectSortBy, setCurrent } from "../../store/features/controls/controlsSlice";
import { Sort } from "../../types/Sort";
import { useWeatherLoader } from "./useWeatherLoader";
import './Table.scss';

interface TableProps {
  className?: string;
}

export const Table:React.FC<TableProps> = ({ className }) => {
  const [displayed, setDisplayed] = useState<CityData[]>([]);
  const dispatch = useAppDispatch();
  const country = useAppSelector(selectCountry);
  const selected = useAppSelector(selectSelected);
  const sortBy = useAppSelector(selectSortBy);
  const order = useAppSelector(selectOrder);
  const cash = useAppSelector(selectCash);
  const loadWeather = useWeatherLoader();

  const sortTable = () => {
    const orderValue = order ? 1 : -1;
    let sortedArray: CityData[] = [];
    
    switch (sortBy) {
      case Sort.byNames:
        sortedArray = [...displayed].sort((a, b) => orderValue * a.name.localeCompare(b.name));
        break;
  
      case Sort.byMax:
        sortedArray = [...displayed].sort((a, b) => orderValue * (Number(a.weather?.dailyMax) - Number(b.weather?.dailyMax)));
        break;
  
      case Sort.byMin:
        sortedArray = [...displayed].sort((a, b) => orderValue * (Number(a.weather?.dailyMin) - Number(b.weather?.dailyMin)));
        break;
  
      default:
        sortedArray = [...displayed].sort((a, b) => orderValue * (Number(a.population) - Number(b.population)));
    }
    
    setDisplayed(sortedArray);
  };
  
  const updateCities = async () => {
    if (!country.length) return;

    const results = await Promise.allSettled([...country, ...selected].map(c => loadWeather(c)));
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
  };

  useEffect(() => {
    updateCities();
  }, [country]);

  useEffect(() => {
    dispatch(checkCurrent());
  }, [country]);

  useEffect(() => {
    sortTable();
  }, [sortBy, order]);
  
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
        {displayed.map(city => <City key={city.geoNameId} city={city} />)}
      </tbody>
    </table>
  )
};
