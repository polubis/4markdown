const downloadJSON = <TData>({ data, name }: { data: TData; name: string }) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: `application/json` });
  const a = document.createElement(`a`);
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export { downloadJSON };
