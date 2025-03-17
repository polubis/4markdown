import { useMindmapPreviewState } from '.';
import type { MindmapPreviewEmbeddedNode } from './models';

const { set } = useMindmapPreviewState;

const closeNodePreviewAction = (): void => {
  set({
    nodePreview: { is: `off` },
  });
};

const openNodePreviewAction = (data: MindmapPreviewEmbeddedNode): void => {
  set({
    nodePreview: { is: `on`, ...data },
  });
};

export { closeNodePreviewAction, openNodePreviewAction };
