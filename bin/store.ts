import Conf from 'conf';

const store = new Conf();

const accessTokenStoreKey = 'linky/accessToken';
const refreshTokenStoreKey = 'linky/refreshToken';
const usagePointIDStoreKey = 'linky/usagePointId';
const sandboxStoreKey = 'linky/sandbox';

export const getAccessToken: () => string = () => store.get(accessTokenStoreKey, '') as string;
export const getRefreshToken: () => string = () => store.get(refreshTokenStoreKey, '') as string;
export const getUsagePointID: () => string = () => store.get(usagePointIDStoreKey, '') as string;
export const getSandbox: () => boolean = () => Boolean(store.get(sandboxStoreKey, false));

export const setAccessToken = (accessToken: string) => store.set(accessTokenStoreKey, accessToken);
export const setRefreshToken = (refreshToken: string) => store.set(refreshTokenStoreKey, refreshToken);
export const setUsagePointID = (usagePointID: string) => store.set(usagePointIDStoreKey, usagePointID);
export const setSandbox = (sandbox: boolean) => store.set(sandboxStoreKey, sandbox);
