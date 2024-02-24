import React from 'react';
import { usePortal } from 'development-kit/use-portal';
import { Badge, BadgeProps } from './badge';
import c from 'classnames';

interface StatusProps extends BadgeProps {}

const Status = ({ className, ...props }: StatusProps) => {
  const { render } = usePortal();

  return render(
    <Badge
      className={c(
        `fixed top-2 left-0 right-0 mx-auto w-fit shadow-xl z-50 normal-case`,
        className,
      )}
      {...props}
    />,
  );
};

export { Status };
