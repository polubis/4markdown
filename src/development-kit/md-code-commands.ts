type MdCodeCommands = {
  tabs: boolean;
};

const analyze = (rawCommand: unknown): MdCodeCommands => {
  const commands: MdCodeCommands = {
    tabs: false,
  };

  if (typeof rawCommand !== `string`) {
    return commands;
  }

  commands.tabs = /\[tabs\]/.test(rawCommand);

  return commands;
};

const toTabs = (snippet: string, commands: MdCodeCommands) => {
  const sections = snippet.split(`\n`);
  console.log(sections);
};

export { analyze, toTabs };
