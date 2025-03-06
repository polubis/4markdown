import React, { type FormEventHandler } from 'react';
import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import { useAuthStore } from 'store/auth/auth.store';
import { YourMindmapsContainer } from './your-mindmaps.container';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  activeMindmapSelector,
  safeActiveMindmapSelector,
} from 'store/mindmap-creator/selectors';
import { Button } from 'design-system/button';
import { BiCheck, BiDotsHorizontal, BiEdit, BiSave, BiX } from 'react-icons/bi';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { useForm } from 'development-kit/use-form';
import { maxLength, minLength } from 'development-kit/form';
import { validationLimits } from '../core/validation';
import { updateMindmapNameAct } from 'acts/update-mindmap-name.act';

const Loader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

const EditNameFormContainer = ({ onClose }: { onClose(): void }) => {
  const activeMindmap = useMindmapCreatorState(safeActiveMindmapSelector);
  const [{ values, invalid, untouched }, { inject }] = useForm(
    { name: activeMindmap.name },
    {
      name: [
        minLength(validationLimits.name.min),
        maxLength(validationLimits.name.max),
      ],
    },
  );

  const handleNameChangeConfirm: FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    const result = await updateMindmapNameAct(values);

    if (result.is === `ok`) onClose();
  };

  return (
    <form className="flex items-center" onSubmit={handleNameChangeConfirm}>
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
        disabled={invalid || untouched}
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
        onClick={onClose}
      >
        <BiX />
      </Button>
    </form>
  );
};

const ActiveMindmapBarContainer = () => {
  const activeMindmap = useMindmapCreatorState(activeMindmapSelector);
  const editNameFormSection = useSimpleFeature();

  return (
    <>
      {activeMindmap ? (
        <>
          {editNameFormSection.isOn ? (
            <EditNameFormContainer onClose={editNameFormSection.off} />
          ) : (
            <>
              <h1 className="font-bold text-lg mr-4 truncate max-w-[260px]">
                {activeMindmap.name}
              </h1>
              <div className="flex items-center space-x-2">
                <Button
                  i={1}
                  s={1}
                  title="Update mindmap name"
                  onClick={editNameFormSection.on}
                >
                  <BiEdit />
                </Button>
                <Button i={1} s={1} title="Save mindmap changes">
                  <BiSave />
                </Button>
                <YourMindmapsContainer />
                <Button i={1} s={1} title="Open mindmap details">
                  <BiDotsHorizontal />
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h1 className="font-bold text-lg mr-4 truncate max-w-[260px]">
            Mindmap Creator
          </h1>
          <YourMindmapsContainer />
        </>
      )}
    </>
  );
};

const SubNavContainer = () => {
  const authStore = useAuthStore();

  React.useEffect(() => {
    authStore.is === `authorized` && getYourMindmapsAct();
  }, [authStore]);

  return (
    <>
      {authStore.is === `idle` && <Loader />}

      {authStore.is === `unauthorized` && (
        <h1 className="font-bold text-lg mr-4 truncate max-w-[260px]">
          Mindmap Creator
        </h1>
      )}

      {authStore.is === `authorized` && <ActiveMindmapBarContainer />}
    </>
  );
};

export { SubNavContainer };
