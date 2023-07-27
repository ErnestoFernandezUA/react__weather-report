import Select, {
  ControlProps,
  OptionProps,
  StylesConfig,
  CSSObjectWithLabel,
  ActionMeta,
  MultiValue,
} from 'react-select';
import classNames from 'classnames';
import { CityData } from '../../types/City';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changeDisplayed,
  saveKeys,
  selectAllData,
  selectAllKeys,
  selectSelectedCountries,
} from '../../store/features/controls/controlsSlice';

type OptionType = { value: string; label: string };

enum ActionSelect {
  SelectOption = 'select-option',
  RemoveValue = 'remove-value',
  PopValue = 'pop-value',
}

interface ControlsProps {
  className?: string;
}

export const Controls: React.FC<ControlsProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const selectedCountries = useAppSelector(selectSelectedCountries);
  const allData = useAppSelector(selectAllData);
  const keys = useAppSelector(selectAllKeys);

  const onChangeCountryHandler = (
    selectedOptions: MultiValue<OptionType>,
    { action }: ActionMeta<OptionType>,
  ) => {
    if (action === ActionSelect.SelectOption
    || action === ActionSelect.RemoveValue
    || action === ActionSelect.PopValue) {
      if (allData && Array.isArray(selectedOptions)) {
        const allCountries: CityData[] = [];

        selectedOptions.forEach((option: OptionType) => {
          if (option.value in allData) {
            allCountries.push(...allData[option.value]);
          }
        });

        dispatch(saveKeys(selectedOptions));
        dispatch(changeDisplayed(allCountries));
      }
    }
  };

  const customStyles: StylesConfig<OptionType, true> = {
    control: (
      base: CSSObjectWithLabel, state: ControlProps<OptionType, true>,
    ) => {
      return {
        ...base,
        background: '#313131',
        borderRadius: state.isFocused ? '12px 12px 12px 12px' : 12,
        borderColor: state.isFocused ? '#191919' : '#e2e2e2',
        boxShadow: state.isFocused ? '0 0 0 1px #191919' : undefined,
        '&:hover': {
          borderColor: state.isFocused ? '#191919' : '#e2e2e2',
          borderRadius: state.isFocused ? '12px 12px 12px 12px' : 12,
        },
      };
    },
    option: (
      styles: CSSObjectWithLabel,
      { isDisabled, isFocused, isSelected }: OptionProps<OptionType, true>,
    ) => {
      let backgroundColor;
      let color;
      let cursor;

      if (isDisabled) {
        backgroundColor = undefined;
        color = '#ccc';
        cursor = 'not-allowed';
      } else if (isSelected) {
        backgroundColor = '#087217';
        color = 'white';
        cursor = 'default';
      } else if (isFocused) {
        backgroundColor = '#e2e2e2';
        color = 'black';
      } else {
        backgroundColor = undefined;
        color = 'black';
      }

      return {
        ...styles,
        backgroundColor,
        color,
        cursor,
        borderRadius: '12px',
      };
    },
    menuList: (
      base: CSSObjectWithLabel,
      // props: MenuListProps<OptionType, true, GroupBase<OptionType>>,
    ) => {
      return {
        ...base,
        borderRadius: '12px',
      };
    },
  };

  return (
    <div className={classNames('Controls', className)}>
      <label htmlFor="countries">
        {keys?.length && (
          <Select
            id="countries"
            onChange={onChangeCountryHandler}
            options={keys || []}
            defaultValue={selectedCountries}
            isMulti
            styles={customStyles}
          />
        )}
      </label>
    </div>
  );
};
