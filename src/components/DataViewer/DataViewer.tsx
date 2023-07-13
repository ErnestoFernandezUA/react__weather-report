import classNames from "classnames";
import { Controls } from "../Controls";
import { Table } from "../Table";
import { WrapperContent } from "../WrapperContent";
import './DataViewer.scss';

interface DataViewerProps { className?: string; }

export const DataViewer:React.FC<DataViewerProps> = ({ className }) => 
  <WrapperContent className={classNames("DataViewer", className)}>
    <Controls />
    <Table />
  </WrapperContent>
