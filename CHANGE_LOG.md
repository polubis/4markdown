# Changelog

## Mindmaps

preview
url

```
const fitViewOptions = {
  duration: 700,
};

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = () => {
  const buildId = randomUUID();

  process.env.GATSBY_BUILD_ID = buildId;
};

import React from 'react';
import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

const ExamplesContainer = () => {
  const examplesModal = useSimpleFeature();

  return (
    <>
      <Button
        i={1}
        s={2}
        auto
        className="md:flex hidden"
        title="Show examples"
        onClick={examplesModal.toggle}
      >
        Examples
      </Button>
      {examplesModal.isOn && (
        <Modal onClose={examplesModal.off}>
          <Modal.Header
            title="Mindmap Examples"
            closeButtonTitle="Close mindmap examples window"
          />
        </Modal>
      )}
    </>
  );
};

export { ExamplesContainer };

```
