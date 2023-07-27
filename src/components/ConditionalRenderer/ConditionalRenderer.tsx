import { ReactNode, useEffect } from 'react';
import { Loader } from '../Loader';

interface ConditionalRendererProps {
  child?: ReactNode;
  isLoading?: boolean;
  error?: string | null | undefined;
}

export const ConditionalRenderer: React.FC<ConditionalRendererProps> = ({
  child,
  isLoading = false,
  error,
}) => {
  useEffect(() => {
  }, [isLoading, error, child]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <>{error}</>;
  }

  return <>{child}</>;
};
