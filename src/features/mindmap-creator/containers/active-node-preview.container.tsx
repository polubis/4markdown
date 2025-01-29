import React from 'react';
import c from 'classnames';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { usePortal } from 'development-kit/use-portal';
import { toggleMindmapNodeAction } from 'store/mindmap-creator/actions';
import { Markdown } from 'components/markdown';

const ActiveNodePreviewContainer = () => {
  const { activeMindmapNode } = useMindmapCreatorState(mindmapReadySelector);
  const { render } = usePortal();

  if (!activeMindmapNode) return null;

  return render(
    <aside
      data-testid="[mindmap-preview]:side-content"
      className={c(
        `fixed top-0 right-0 h-full overflow-y-auto border-l border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black max-w-xl`,
      )}
    >
      <div className="p-4 flex gap-2 items-center h-[72px]">
        <h6 className="text-xl mr-4">{activeMindmapNode.data.name}</h6>
        <Button
          i={2}
          s={1}
          title="Close navigation"
          onClick={() => toggleMindmapNodeAction(null)}
        >
          <BiX />
        </Button>
      </div>
      <div className="p-4 pb-0 flex flex-col gap-2 h-[calc(100svh-72px)]">
        <Markdown>
          {activeMindmapNode.type === `document`
            ? activeMindmapNode.data.document.code
            : activeMindmapNode.data.content}
        </Markdown>
      </div>
    </aside>,
  );
};

export { ActiveNodePreviewContainer };
