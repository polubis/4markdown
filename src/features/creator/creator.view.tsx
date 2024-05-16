import React from 'react';
import { queue } from './queue';
import { mock } from './mock';

const CreatorView: React.FC = () => {
  React.useEffect(() => {
    const { enq } = queue();

    const request1 = mock(1000, `request1`);
    const request2 = mock(500, `request2`);
    const request3 = mock(1200, `request3`);
    const request4 = mock(100, `request4`);
    // 2 1 3 4
    enq(request2, request1, request3);
    enq(request4);
  }, []);

  return <></>;
};

export default CreatorView;
