type Token = string;
type Dependency = { new (): unknown } | unknown;

const isConstructor = <TInstance>(
  dependency: Dependency,
): dependency is { new (): TInstance } => {
  return typeof dependency === `function` && `prototype` in dependency;
};

class DIContainer {
  private instances = new Map<Token, Dependency>();

  register = <TInstance>(
    token: Token,
    constructor: { new (): TInstance },
  ): void => {
    this.instances.set(token, constructor);
  };

  get = <TInstance>(token: Token): TInstance => {
    const Dependency = this.instances.get(token);

    if (!Dependency) {
      throw new Error(`You forgot to register dependency with token: ${token}`);
    }

    if (isConstructor<TInstance>(Dependency)) {
      const instance = new Dependency();
      this.instances.set(token, instance);
      return instance;
    }

    return Dependency as TInstance;
  };
}

const container = new DIContainer();

class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

class ApiService {
  fetchData(): void {
    const loggerService = container.get<Logger>(`logger`);
    loggerService.log(`hi`);
  }
}

container.register(`logger`, Logger);
container.register(`apiService`, ApiService);

const apiService = container.get<ApiService>(`apiService`);
apiService.fetchData();
