import { CityFullData } from "../../types/City";
import { City } from "../City";

import './Table.scss';

interface TableProps {
  country: CityFullData[] | null;
  onClickSelectHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>, city: CityFullData, isSelected: boolean) => void;
  selectedCities: CityFullData[];
  onClickCurrentHandler: (city: CityFullData) => void;
}

export const Table:React.FC<TableProps> = ({ country, selectedCities, onClickSelectHandler, onClickCurrentHandler }) => {

  if (!country) {
    return null;
  }  

  return (
    <>
      <table className="Table">
        <tbody>
          {country?.map((city, i) => (
            <City 
              key={city.geoNameId} 
              city={city} 
              onClickSelectHandler={onClickSelectHandler}
              selectedCities={selectedCities}
              onClickCurrentHandler={onClickCurrentHandler}
            />
          ))}
        </tbody>
      </table>
    </>
  )
};
