type FirstParameter<T> = T extends (arg1: infer P, ...args: any[]) => any
  ? P
  : never;

type ConsumersBase = Record<string, (payload: any) => Promise<any>>;

type Subscription<TPayload> = (payload: TPayload) => void;

type SubId = Symbol;

type Subscriber<TType> = {
  id: SubId;
  type: TType;
};

class EventsChannel<TConsumers extends ConsumersBase> {
  private subscriptions = new Map<
    keyof TConsumers,
    Map<SubId, Subscription<FirstParameter<TConsumers[keyof TConsumers]>>>
  >();

  private consumers: TConsumers;

  constructor(consumers: TConsumers) {
    this.consumers = consumers;
  }

  dispatch = async <TType extends keyof TConsumers>(
    type: TType,
    payload: FirstParameter<TConsumers[TType]>,
  ): Promise<TConsumers[TType]> => {
    this.subscriptions.get(type)?.forEach((sub) => sub(payload));
    const result = await this.consumers[type]({ type, payload });
    return result;
  };

  subscribe = <TType extends keyof TConsumers>(
    type: TType,
    subscription: Subscription<FirstParameter<TConsumers[TType]>>,
  ): Subscriber<TType> => {
    const id = Symbol(`Subscription id`);

    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, new Map());
    }

    this.subscriptions.get(type)?.set(id, subscription);

    return { id, type };
  };

  unsubscribeAll = (): void => {
    this.subscriptions.clear();
  };

  unsubscribe = <TType extends keyof TConsumers>(
    subscriber: Subscriber<TType>,
  ): void => {
    this.subscriptions.get(subscriber.type)?.delete(subscriber.id);
  };
}

export { EventsChannel };
