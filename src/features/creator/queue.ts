type QueueTask = () => Promise<unknown>;

const queue = () => {
  const allTasks: QueueTask[] = [];
  let ticking = false;
  let processing = false;

  const tick = () => {
    ticking = true;

    const interval = setInterval(async () => {
      if (processing) return;

      const task = allTasks.shift();

      if (typeof task === `function`) {
        processing = true;
        await task();
        processing = false;
        return;
      }

      ticking = false;
      clearInterval(interval);
    }, 50);
  };

  return {
    enq: async (...tasks: QueueTask[]) => {
      tasks.forEach((task) => allTasks.push(task));
      ticking || tick();
    },
    deq: () => {
      allTasks.shift();
    },
  };
};

export { queue };
