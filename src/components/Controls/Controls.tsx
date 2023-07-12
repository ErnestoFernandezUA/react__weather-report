import { useEffect, useState } from "react";
import Select, { ControlProps, OptionProps, StylesConfig, CSSObjectWithLabel } from 'react-select';
import { CityData } from "../../types/City";
import data from '../../data/data.json';
import { useAppDispatch } from "../../store/hooks";
import { addChosenCountry } from "../../store/features/controls/controlsSlice";

import './Controls.scss';
import { useWidthContent } from "../../hooks/useWidthContent";
import classNames from "classnames";

type OptionType = { value: string; label: string };

interface ControlsProps {
  className?: string;
}

export const Controls:React.FC<ControlsProps> = ({ className }) => {
  const [allData, setAllData] = useState<{ [key: string]: CityData[] } | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);
  const dispatch = useAppDispatch();
  const { widthSelect } = useWidthContent(); 

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

  console.log('widthSelect', widthSelect);

  const customStyles: StylesConfig<OptionType, true> = {
    control: (base: CSSObjectWithLabel, state: ControlProps<OptionType, true>) => ({
      ...base,
      width: widthSelect,
      background: '#f3f3f3',
      borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
      borderColor: state.isFocused ? '#673ab7' : '#e2e2e2',
      boxShadow: state.isFocused ? '0 0 0 1px #673ab7' : undefined,
      '&:hover': {
        borderColor: state.isFocused ? '#673ab7' : '#e2e2e2',
      }
    }),
    option: (styles: CSSObjectWithLabel, { isDisabled, isFocused, isSelected }: OptionProps<OptionType, true>) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : (isSelected ? '#673ab7' : (isFocused ? '#e2e2e2' : undefined)),
        color: isDisabled ? '#ccc' : (isSelected ? 'white' : 'black'),
        cursor: isDisabled ? 'not-allowed' : 'default',
      };
    },
  }

  return (
    <div className={classNames("Controls", className)}>
      <label htmlFor="countries">
        <Select 
           id="countries"
           onChange={onChangeCountryHandler}
           options={keys || []} 
           defaultValue={keys && keys.length > 0 ? keys[0] : undefined}
           isMulti={true}
           styles={customStyles}
        />
      </label>
    </div>
  )
};
