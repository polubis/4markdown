const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  // date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  date.setTime(date.getTime() + 5000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; Secure; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(`; `);

  for (const cookie of cookies) {
    const [key, value] = cookie.split(`=`);
    if (key === name) {
      return value;
    }
  }

  return null;
};

export { setCookie, getCookie };
