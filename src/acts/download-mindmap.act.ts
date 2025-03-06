import { useMindmapCreatorState } from 'store/mindmap-creator';

const downloadMindmapAct = (): void => {
  const { orientation, nodes, edges } = useMindmapCreatorState.get();

  const data = {
    orientation,
    nodes,
    edges,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: `application/json` });
  const a = document.createElement(`a`);
  a.href = URL.createObjectURL(blob);
  a.download = `data.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export { downloadMindmapAct };
