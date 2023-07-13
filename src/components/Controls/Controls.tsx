import { useEffect, useState } from "react";
import Select, { ControlProps, OptionProps, StylesConfig, CSSObjectWithLabel, GroupBase, MenuListProps } from 'react-select';
import classNames from "classnames";
import { CityData } from "../../types/City";
import data from '../../data/data.json';
import { useAppDispatch } from "../../store/hooks";
import { addChosenCountry } from "../../store/features/controls/controlsSlice";
import './Controls.scss';

type OptionType = { value: string; label: string };

interface ControlsProps {
  className?: string;
}

export const Controls:React.FC<ControlsProps> = ({ className }) => {
  const [allData, setAllData] = useState<{ [key: string]: CityData[] } | null>(null);
  const [keys, setKeys] = useState<{ value: string; label: string }[] | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
     
      console.log('dispatch(addChosenCountry(allCountries));')
      dispatch(addChosenCountry(allCountries));
    }
  };

  const customStyles: StylesConfig<OptionType, true> = {
    control: (base: CSSObjectWithLabel, state: ControlProps<OptionType, true>) => {
      return {
        ...base,
        background: '#313131',
        borderRadius: state.isFocused ? '12px 12px 12px 12px' : 12,
        borderColor: state.isFocused ? '#191919' : '#e2e2e2',
        boxShadow: state.isFocused ? '0 0 0 1px #191919' : undefined,
        '&:hover': {
          borderColor: state.isFocused ? '#191919' : '#e2e2e2',
          borderRadius: state.isFocused ? '12px 12px 12px 12px' : 12,
        }
      }},
    option: (styles: CSSObjectWithLabel, { isDisabled, isFocused, isSelected }: OptionProps<OptionType, true>) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : (isSelected ? '#087217' : (isFocused ? '#e2e2e2' : undefined)),
        color: isDisabled ? '#ccc' : (isSelected ? 'white' : 'black'),
        cursor: isDisabled ? 'not-allowed' : 'default',
        borderRadius: '12px',
      };
    },
    menuList: (base: CSSObjectWithLabel, props: MenuListProps<OptionType, true, GroupBase<OptionType>>) => {
      return {
        ...base,
        borderRadius: '12px',
      };
    },
  }

  const defaultValue = keys && keys.length > 0 ? keys[0] : undefined;

  return (
    <div className={classNames("Controls", className)}>
      <label htmlFor="countries">
        {defaultValue && keys?.length && (
          <Select 
             id="countries"
             onChange={onChangeCountryHandler}
             options={keys || []} 
             defaultValue={defaultValue}
             isMulti={true}
             styles={customStyles}
          />
        )}
      </label>
    </div>
  )
};
