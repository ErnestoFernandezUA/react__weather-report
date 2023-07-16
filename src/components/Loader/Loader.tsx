import { RiLoader4Fill } from "react-icons/ri";
import './Loader.scss';

export default function Loader() {
  return (
    <div className="Loader">
      <div className="Loader__container">
        <RiLoader4Fill height={10} width={10} />
      </div>
    </div>
  );
}