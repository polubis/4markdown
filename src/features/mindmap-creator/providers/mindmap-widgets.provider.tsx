import { context } from 'development-kit/context';
import { useSimpleFeature } from '@greenonsoftware/first-class-hooks';

const [MindmapModalsProvider, useMindmapModalsContext] = context(() => {
  return {
    nodesRemovalConfirm: useSimpleFeature(),
    nodeCreation: useSimpleFeature(),
  };
});

export { MindmapModalsProvider, useMindmapModalsContext };
