type QueueTask = () => Promise<unknown>;

class Queue {
  #tasks: QueueTask[] = [];
  #isTicking = false;

  //   request2, request1, request3, request4

  tick() {
    this.#isTicking = true;

    const interval = setInterval(async () => {
      const task = this.#tasks.shift();
      console.log(this.#tasks);
      if (typeof task === `function`) {
        await task();
        return;
      }

      this.#isTicking = false;
      clearInterval(interval);
    });
  }

  async enq(...tasks: QueueTask[]) {
    tasks.forEach((task) => this.#tasks.push(task));
    this.#isTicking || this.tick();
  }

  deq() {}
}

export { Queue };
