import { context } from 'development-kit/context';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

const [MindmapModalsProvider, useMindmapModalsContext] = context(() => {
  return {
    nodesRemovalConfirm: useSimpleFeature(),
    nodeCreation: useSimpleFeature(),
    mindmapsListModal: useSimpleFeature(),
  };
});

export { MindmapModalsProvider, useMindmapModalsContext };
