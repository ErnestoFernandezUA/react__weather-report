import { ReactNode, useEffect } from 'react';
import { Loader } from '../Loader';

interface ConditionalRendererProps {
  children?: ReactNode;
  isLoading?: boolean;
  error?: string | null | undefined;
}

export const ConditionalRenderer: React.FC<ConditionalRendererProps> = ({
  children,
  isLoading = false,
  error,
}) => {
  useEffect(() => {
  }, [isLoading, error, children]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <>{error}</>;
  }

  return <>{children}</>;
};
