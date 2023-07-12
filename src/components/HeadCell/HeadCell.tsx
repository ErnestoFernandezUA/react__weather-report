import classNames from "classnames";
import { IoArrowDownOutline, IoArrowUp } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectOrder, selectSortBy, sort } from "../../store/features/controls/controlsSlice";
import { Sort } from "../../types/Sort";
import './HeadCell.scss';

const headerControls: {
  [ key in Sort ]: { title: string; inverse?: boolean; }
} = {
  [Sort.byNames]: { title: 'City', inverse: true },
  [Sort.byPopulation]: { title: 'Population' },
  [Sort.byMax]: { title: 'Max Temp' },
  [Sort.byMin]: { title: 'Min Temp' },
}

interface HeadCellProps {
  type?: Sort;
  title?: string;
  inverse?: boolean;
  className?: string;
}

export const HeadCell:React.FC<HeadCellProps> = ({ 
  type,
  title,
  className,
  inverse = false,
}) => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const order = useAppSelector(selectOrder);
  const onClickSort = (sortBy?: Sort) => sortBy && dispatch(sort(sortBy));
  const isActive = sortBy === type;
  const direction = inverse ? !order : order;

  return (
    <th 
      onClick={() => onClickSort(type)}
      className={classNames('Table__controls',
        {'Table__controls--active': isActive},
        className,
      )}
    >
      {title ? title : type && headerControls[type].title}
      {isActive && (direction ? <IoArrowDownOutline /> : <IoArrowUp />)}
    </th>
  )
};
