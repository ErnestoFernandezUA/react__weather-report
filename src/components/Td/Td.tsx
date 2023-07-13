import { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { useAppSelector } from "../../store/hooks";
import { selectOrder, selectSortBy } from "../../store/features/controls/controlsSlice";
import { Sort } from "../../types/Sort";

import './Td.scss';

interface TdProps {
  type?: Sort;
  title?: string;
  children?: ReactNode;
}

export const Td:React.FC<TdProps> = ({ 
  type,
  title,
  children,
}) => {
  const [isJustSorted, setIsJustSorted] = useState<boolean>(false);
  const sortBy = useAppSelector(selectSortBy);
  const order = useAppSelector(selectOrder);

  useEffect(() => {
    if (sortBy === type) {
      setIsJustSorted(true);
    }

    setTimeout(() => setIsJustSorted(false), 300);
  }, [sortBy, order, type])

  return (
    <td 
      className={classNames({'Td--just-sorted': isJustSorted})}
    >
      {title}
      {children}
    </td>
  )
};
