import classNames from "classnames";
import { ReactNode } from "react";
import './WrapperContent.scss';

interface WrapperContentViewerProps {
  className?: string;
  children?: ReactNode;
}

export const WrapperContent:React.FC<WrapperContentViewerProps> = ({ className, children }) => {

  return (
    <section className={classNames("WrapperContent", className)}>
      {children}
    </section>
  )
};
