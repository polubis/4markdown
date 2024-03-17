const readFileAsBase64 = (file: File): Promise<FileReader['result']> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export { readFileAsBase64 };
