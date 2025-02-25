import { Button } from 'design-system/button';
import React from 'react';
import { BiCollection } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { openYourMindmapsViewAction } from 'store/mindmap-creator/actions';
import { YourMindmapsModalContainer } from './your-mindmaps-modal.container';

const YourMindmapsContainer = () => {
  const { mindmaps, yourMindmapsView } = useMindmapCreatorState();

  return (
    <>
      <Button
        i={1}
        s={1}
        title="Open your mindmaps"
        disabled={mindmaps.is === `busy`}
        onClick={openYourMindmapsViewAction}
      >
        <BiCollection />
      </Button>
      {yourMindmapsView.is === `active` && <YourMindmapsModalContainer />}
    </>
  );
};

export { YourMindmapsContainer };
