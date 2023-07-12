import { FC, useEffect, useState } from "react";
import { CityData } from "../../types/City";
import data from '../../data/data.json';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addChosenCountry, selectCurrent, selectSelected, sort } from "../../store/features/controls/controlsSlice";
import { Sort } from "../../types/Sort";

import './Controls.scss';


export const Controls:FC = () => {
  const [allData, setAllData] = useState<{ [key: string]: CityData[]} | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);
  const dispatch = useAppDispatch();
  const onClickPopulation = () => dispatch(sort(Sort.byPopulation));
  const onClickName = () => dispatch(sort(Sort.byNames));
  const onClickMax = () => dispatch(sort(Sort.byMax));
  const onClickMin = () => dispatch(sort(Sort.byMin));

  useEffect(() => {
    console.log('setdata');   
    setAllData(data.data);
    setKeys(data.keys);
  }, [])

  useEffect(() => {   
    allData && dispatch(addChosenCountry(allData[data.keys[0].value]));
  }, [allData])

  const onChangeCountryHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    if (allData && e.currentTarget.value in allData) {
      dispatch(addChosenCountry(allData[e.currentTarget.value]));
    }
  };

  return (
    <div className="Controls">
      <button onClick={onClickPopulation}>byPopulation</button>
          <button onClick={onClickName}>byName</button>
          <button onClick={onClickMax}>byMax</button>
          <button onClick={onClickMin}>byMin</button>

          <label htmlFor="countries">
            <select 
              name="countries" 
              id="countries"
              onChange={(e) => onChangeCountryHandler(e)}
              defaultValue={keys?.length && keys[0].value}
            >
              {keys && keys.map(el => 
                <option 
                  key={el.value}
                  value={el.value}
                >
                  {el.label}
              </option>)}
            </select>
          </label>
    </div>
  )
};