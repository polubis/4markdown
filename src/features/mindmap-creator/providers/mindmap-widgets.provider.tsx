import { context } from 'development-kit/context';
import { useSimpleFeature } from 'development-kit/use-simple-feature';

const [MindmapModalsProvider, useMindmapModalsContext] = context(() => {
  return {
    creation: useSimpleFeature(),
  };
});

export { MindmapModalsProvider, useMindmapModalsContext };
