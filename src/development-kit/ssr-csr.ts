const isServer = (): boolean => typeof window === `undefined`;
const isClient = (): boolean => !isServer();

export { isServer, isClient };
