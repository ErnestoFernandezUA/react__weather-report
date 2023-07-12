import { useEffect, useState } from "react";
import Select from 'react-select';
import { CityData } from "../../types/City";
import data from '../../data/data.json';
import { useAppDispatch } from "../../store/hooks";
import { addChosenCountry } from "../../store/features/controls/controlsSlice";

import './Controls.scss';

export const Controls:React.FC = () => {
  const [allData, setAllData] = useState<{ [key: string]: CityData[]} | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('setdata');   
    setAllData(data.data);
    setKeys(data.keys);
  }, [])

  useEffect(() => {   
    allData && dispatch(addChosenCountry(allData[data.keys[0].value]));
  }, [allData])

  const onChangeCountryHandler = (selectedOptions: any) => {
    if (allData && Array.isArray(selectedOptions)) {
      
      const allCountries: CityData[] = []; 

      for (const option of selectedOptions) {
        if (option.value in allData) {
          allCountries.push(...allData[option.value]);
        }
      }
     
      dispatch(addChosenCountry(allCountries));
    }
  };

  return (
    <div className="Controls">
      <label htmlFor="countries">
        <Select 
           name="countries" 
           id="countries"
           onChange={onChangeCountryHandler}
           options={keys || []} 
           defaultValue={keys && keys.length > 0 ? keys[0] : undefined}
           isMulti={true}
        />
      </label>
    </div>
  )
};
