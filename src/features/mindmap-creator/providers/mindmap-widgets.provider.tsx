import { context } from 'development-kit/context';
import { useSimpleFeature } from '@greenonsoftware/first-class-hooks';

const [MindmapModalsProvider, useMindmapModalsContext] = context(() => {
  return {
    creation: useSimpleFeature(),
  };
});

export { MindmapModalsProvider, useMindmapModalsContext };
