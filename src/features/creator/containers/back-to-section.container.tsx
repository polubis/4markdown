import { Button } from 'design-system/button';
import React from 'react';
import { useBackTo } from '../utils/use-back-to';

// eslint-disable-next-line react/display-name
const BackToSectionContainer = React.memo(
  () => {
    const { denyBackTo, backTo, ...backToState } = useBackTo();

    if (backToState.is === `off`) {
      return null;
    }

    return (
      <div className="fixed md:bottom-4 bottom-[142px] right-4 flex items-center gap-2">
        <Button i={2} s={2} auto onClick={denyBackTo}>
          Deny
        </Button>
        <Button i={2} s={2} auto onClick={backTo}>
          Accept Changes
        </Button>
      </div>
    );
  },
  () => true,
);

export { BackToSectionContainer };
