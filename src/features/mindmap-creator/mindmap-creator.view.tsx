import React from 'react';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';

const MindmapCreatorEditorContainer = React.lazy(() =>
  import(`./containers/mindmap-creator-editor.container`).then((m) => ({
    default: m.MindmapCreatorEditorContainer,
  })),
);

const MindmapCreatorView = () => {
  React.useEffect(() => {
    mindmapCreatorStoreActions.load();
  }, []);

  return <MindmapCreatorEditorContainer />;
};

export { MindmapCreatorView };
