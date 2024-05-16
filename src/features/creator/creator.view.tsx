import React from 'react';
import { queue } from './queue';
import { mock } from './mock';
import { motion, AnimationProps } from 'framer-motion';
import { Button } from 'design-system/button';
import classNames from 'classnames';

const props: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const { enq, deq } = queue();

type TaskBadge = {
  label: string;
  status: 'pending' | 'error' | 'skipped' | 'finished';
};

const CreatorView: React.FC = () => {
  const [tasks, setTasks] = React.useState<TaskBadge[]>([]);

  const addTask = (label: TaskBadge['label']) => {
    setTasks((prevTasks) => [...prevTasks, { status: `pending`, label }]);
  };

  const changeTask = (
    label: TaskBadge['label'],
    status: TaskBadge['status'],
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.label === label ? { ...task, status } : task,
      ),
    );
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
          addTask(`request2`);
          await request2();
          changeTask(`request2`, `finished`);
        } catch (err) {}
      },
      async () => {
        addTask(`request1`);
        await request1();
        changeTask(`request1`, `finished`);
      },
      async () => {
        addTask(`request4`);
        await request4();
        changeTask(`request4`, `finished`);
      },
    );
    enq(async () => {
      addTask(`request3`);
      await request3();
      changeTask(`request3`, `finished`);
    });
  }, []);

  return (
    <>
      <div className="p-4 flex items-center flex-wrap gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task.label}
            className={classNames(
              `text-xl rounded-md text-black shadow-md p-4`,
              { 'bg-gray-500 animate-pulse': task.status === `pending` },
              { 'bg-green-500': task.status === `finished` },
              { 'bg-red-500': task.status === `error` },
              { 'bg-yellow-500': task.status === `skipped` },
            )}
            {...props}
          >
            {task.label}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col space-y-2 p-4">
        <h6 className="text-2xl">Legend</h6>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <strong>Pending:</strong>
            <div className="bg-gray-500 animate-pulse h-5 w-5 rounded-full" />
          </div>
          <div className="flex items-center space-x-2">
            <strong>Ok:</strong>
            <div className="bg-green-500 h-5 w-5 rounded-full" />
          </div>
          <div className="flex items-center space-x-2">
            <strong>Error:</strong>
            <div className="bg-red-500 h-5 w-5 rounded-full" />
          </div>
          <div className="flex items-center space-x-2">
            <strong>Skipped/Cancelled:</strong>
            <div className="bg-yellow-500 h-5 w-5 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-4 mt-10 flex space-x-3">
        <Button s={2} i={2} auto onClick={addNewRandomTask}>
          Enqueue
        </Button>
        <Button s={2} i={2} auto onClick={deq}>
          Dequeue
        </Button>
      </div>
    </>
  );
};

export default CreatorView;
