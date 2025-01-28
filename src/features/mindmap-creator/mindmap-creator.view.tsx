import { ReactFlowProvider } from '@xyflow/react';
import React, { type ComponentType } from 'react';

const WithReactFlowProvider = <P extends object>(
  Component: ComponentType<P>,
) => {
  const WrappedComponent = (props: P) => (
    <ReactFlowProvider>
      <Component {...props} />
    </ReactFlowProvider>
  );

  return WrappedComponent;
};
const MindmapCreatorView = WithReactFlowProvider(() => {
  return <main></main>;
});

export { MindmapCreatorView };
