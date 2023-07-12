import { useEffect, useState } from "react";
import Select, { ControlProps, OptionProps, StylesConfig, CSSObjectWithLabel, ContainerProps, GroupBase, MenuListProps } from 'react-select';
import classNames from "classnames";
import { CityData } from "../../types/City";
import data from '../../data/data.json';
import { useAppDispatch } from "../../store/hooks";
import { addChosenCountry } from "../../store/features/controls/controlsSlice";
import { useWidthContent } from "../../hooks/useWidthContent";
import './Controls.scss';

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
    console.log('setData');   
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
      // width: widthSelect,
      background: '#f3f3f3',
      borderRadius: state.isFocused ? '12px 12px 12px 12px' : 12,
      borderColor: state.isFocused ? '#673ab7' : '#e2e2e2',
      boxShadow: state.isFocused ? '0 0 0 1px #673ab7' : undefined,
      '&:hover': {
        borderColor: state.isFocused ? '#673ab7' : '#e2e2e2',
        borderRadius: state.isFocused ? '12px 12px 12px 12px' : 12,
      }
    }),
    option: (styles: CSSObjectWithLabel, { isDisabled, isFocused, isSelected }: OptionProps<OptionType, true>) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : (isSelected ? '#673ab7' : (isFocused ? '#e2e2e2' : undefined)),
        color: isDisabled ? '#ccc' : (isSelected ? 'white' : 'black'),
        cursor: isDisabled ? 'not-allowed' : 'default',
        borderRadius: '12px',
      };
    },
    menuList: (base: CSSObjectWithLabel, props: MenuListProps<OptionType, true, GroupBase<OptionType>>) => {
      return {
        ...base,
        backgroundColor: '#191919',
        overflow: 'hidden',
        borderRadius: '12px',
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
