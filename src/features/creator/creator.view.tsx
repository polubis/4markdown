import React from 'react';
import { queue } from './queue';
import { mock } from './mock';
import { motion, AnimationProps } from 'framer-motion';
import { Button } from 'design-system/button';

const props: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const { enq } = queue();

const CreatorView: React.FC = () => {
  const [tasks, setTasks] = React.useState<string[]>([]);

  const addTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const addNewRandomTask = () => {
    enq(async () => {
      const id = new Date().toISOString().split(`T`)[1];
      const request = mock(1000, id);
      await request();
      addTask(id);
    });
  };

  React.useEffect(() => {
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

  return (
    <>
      <div className="flex items-center flex-wrap gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task}
            className="text-xl rounded-md bg-slate-400 text-white shadow-md p-4"
            {...props}
          >
            {task}
          </motion.div>
        ))}
      </div>
      <Button className="mt-10" s={2} i={2} auto onClick={addNewRandomTask}>
        Add New Random Task
      </Button>
    </>
  );
};

export default CreatorView;
