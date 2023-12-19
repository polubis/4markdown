type Commands = Record<string, (...args: unknown[]) => void>;
type Data = Record<string, unknown>;

function Gherkin<C extends Commands, D extends Data>(commands: C) {
  let data: D;

  function GetData<K extends keyof D>(key: K) {
    return data[key];
  }

  function GetBackground() {
    return data;
  }

  function Background(newData: D) {
    data = { ...data, ...newData };

    return {
      Given,
    };
  }

  function Given<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    commands[key](...args);

    return {
      Then,
      When,
      And,
    };
  }

  function Then<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    commands[key](...args);

    return {
      And,
      When,
    };
  }

  function When<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    commands[key](...args);

    return {
      And,
      Then,
    };
  }

  function And<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    commands[key](...args);

    return {
      Then,
      When,
      And,
    };
  }

  return { Given, When, GetData, Background, GetBackground };
}

export { Gherkin };
