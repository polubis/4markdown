import React from 'react';
import { queue } from './queue';
import { mock } from './mock';

const CreatorView: React.FC = () => {
  const [tasks, setTasks] = React.useState<string[]>([]);

  const addTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  React.useEffect(() => {
    const { enq } = queue();

    const request1 = mock(1000, `request1`);
    const request2 = mock(500, `request2`);
    const request3 = mock(1200, `request3`);
    const request4 = mock(100, `request4`);

    enq(
      async () => {
        try {
          await request2();
          addTask(`request2`);
        } catch (err) {}
      },
      async () => {
        await request1();
        addTask(`request1`);
      },
      async () => {
        await request4();
        addTask(`request4`);
      },
    );
    enq(async () => {
      await request3();
      addTask(`request3`);
    });
  }, []);

  return <>{tasks.join(`, `)}</>;
};

export default CreatorView;
