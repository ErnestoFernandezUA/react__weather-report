import classNames from 'classnames';
import { Controls } from '../Controls';
import { WrapperContent } from '../WrapperContent';
import { Table } from '../Table';
import './DataViewer.scss';

interface DataViewerProps { className?: string; }

export const DataViewer: React.FC<DataViewerProps> = ({ className }) => (
  <WrapperContent className={classNames('DataViewer', className)}>
    <Controls />
    <Table />
  </WrapperContent>
);
