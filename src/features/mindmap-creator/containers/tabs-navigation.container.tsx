import React, { type FormEventHandler } from 'react';

import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { Button } from 'design-system/button';
import { BiCheck, BiX } from 'react-icons/bi';
import { useForm } from 'development-kit/use-form';
import { updateMindmapNameAct } from 'acts/update-mindmap-name.act';

const EditNameForm = ({ onClose }: { onClose(): void }) => {
  const { activeMindmap, saving } = useMindmapCreatorState(
    mindmapCreatorReadySelector,
  );
  const [{ values, invalid, untouched }, { inject }] = useForm({
    name: activeMindmap.name,
  });

  const saveMindmapChange: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const result = await updateMindmapNameAct(values.name);

    result.is === `ok` && onClose();
  };

  return (
    <form className="flex items-center" onSubmit={saveMindmapChange}>
      <input
        className="w-full px-3 py-1 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
        autoFocus
        placeholder="Type mindmap name*"
        {...inject(`name`)}
      />
      <Button
        i={1}
        s={1}
        className="mr-1 ml-3"
        disabled={invalid || untouched || saving}
        title="Confirm mindmap name change"
        type="submit"
      >
        <BiCheck />
      </Button>
      <Button
        i={1}
        s={1}
        title="Close mindmap name edition"
        type="button"
        disabled={saving}
        onClick={onClose}
      >
        <BiX />
      </Button>
    </form>
  );
};

const TabsNavigationContainer = () => {
  const edition = useSimpleFeature();
  const { activeMindmap } = useMindmapCreatorState(mindmapCreatorReadySelector);

  return (
    <header className="h-[50px] flex items-center border-zinc-300 dark:border-zinc-800 border-b px-4">
      {edition.isOn ? (
        <EditNameForm onClose={edition.off} />
      ) : (
        <button
          className="text-lg max-w-[260px] truncate mr-2 hover:underline underline-offset-4"
          onClick={edition.on}
          title={`Edit ${activeMindmap.name} mindmap`}
        >
          {activeMindmap.name}
        </button>
      )}
    </header>
  );
};

export { TabsNavigationContainer };
