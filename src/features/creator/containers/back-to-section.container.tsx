import { Button } from 'design-system/button';
import React from 'react';
import { useMetadataState } from 'store/metadata';
import { setDocumentCodeAction } from 'store/metadata/actions';
import { meta } from '../../../../meta';
import { navigate } from 'gatsby';
import { useDocumentCreatorState } from 'store/document-creator';

// eslint-disable-next-line react/display-name
const BackToSectionContainer = React.memo(
  () => {
    const documentCode = useMetadataState((state) => state.documentCode);

    const backTo = (): void => {
      setDocumentCodeAction(useDocumentCreatorState.get().code);
      navigate(meta.routes.mindmaps.creator);
    };

    const deny = (): void => {
      navigate(meta.routes.mindmaps.creator);
    };

    if (typeof documentCode !== `string`) {
      return null;
    }

    return (
      <div className="fixed md:bottom-4 bottom-[142px] right-4 flex items-center gap-2">
        <Button i={2} s={2} auto onClick={deny}>
          Deny
        </Button>
        <Button i={2} s={2} auto onClick={backTo}>
          Accept Changes
        </Button>
      </div>
    );
  },
  () => true,
);

export { BackToSectionContainer };
