import { useEffect } from "react";
import classNames from "classnames";
import { City } from "../City";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { 
  checkCurrent,
  selectDisplayed,
  selectLoadingList,
  sortTable
} from "../../store/features/controls/controlsSlice";
import { Sort } from "../../types/Sort";
import { HeadCell } from "../HeadCell";
import './Table.scss';

interface TableProps {
  className?: string;
}

export const Table:React.FC<TableProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const displayed = useAppSelector(selectDisplayed);
  const isLoadingListEmpty = useAppSelector(selectLoadingList).length === 0;

  useEffect(() => {
    dispatch(sortTable());
  }, [isLoadingListEmpty])

  useEffect(() => {
    dispatch(checkCurrent());
  }, [displayed]);
 
  return (
    <table className={classNames("Table", className)}>
      <thead>
        <tr>
          <HeadCell type={Sort.byNames} />
          <HeadCell title="Code" />
          <HeadCell type={Sort.byPopulation} />
          <HeadCell type={Sort.byMax} />
          <HeadCell type={Sort.byMin} />
          <HeadCell title="Wind Direction" />
        </tr>
      </thead>

      <tbody>
        {displayed.map(city => <City key={city.geoNameId} city={city} />)}
      </tbody>
    </table>
  )
};
