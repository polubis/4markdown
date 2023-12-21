type Commands = Record<string, (...args: any[]) => void>;
type Data = Record<string, any>;

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
    cy.log(key as string);
    commands[key](...args);

    return {
      Then,
      When,
      And,
    };
  }

  function Then<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    cy.log(key as string);
    commands[key](...args);

    return {
      And,
      When,
    };
  }

  function When<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    cy.log(key as string);
    commands[key](...args);

    return {
      And,
      Then,
    };
  }

  function And<K extends keyof C>(key: K, ...args: Parameters<C[K]>) {
    cy.log(key as string);
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
