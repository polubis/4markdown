const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== `string`) {
        throw Error(`Cannot read file`);
      }

      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export { readFileAsBase64 };
