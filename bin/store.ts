import Conf from 'conf';

const store = new Conf();

const accessTokenStoreKey = 'linky/accessToken';
const refreshTokenStoreKey = 'linky/refreshToken';
const lastUsagePointIDStoreKey = 'linky/usagePointId';
const failedRefreshAttemptsKey = 'linky/failedRefreshAttempts';
const sandboxStoreKey = 'linky/sandbox';

export const getAccessToken: (prm: string) => string = (prm) => store.get(accessTokenStoreKey + prm, '') as string;
export const getRefreshToken: (prm: string) => string = (prm) => store.get(refreshTokenStoreKey + prm, '') as string;
export const getLastUsagePointID: () => string = () => store.get(lastUsagePointIDStoreKey, '') as string;
export const getFailedRefreshAttempts: (prm: string) => number = (prm) =>
    store.get(failedRefreshAttemptsKey + prm, 0) as number;
export const getSandbox: () => boolean = () => Boolean(store.get(sandboxStoreKey, false));

export const setAccessToken = (accessToken: string, prm: string) => store.set(accessTokenStoreKey + prm, accessToken);
export const setRefreshToken = (refreshToken: string, prm: string) =>
    store.set(refreshTokenStoreKey + prm, refreshToken);
export const setLastUsagePointID = (usagePointID: string) => store.set(lastUsagePointIDStoreKey, usagePointID);
export const setFailedRefreshAttempts = (attempts: number, prm: string) =>
    store.set(failedRefreshAttemptsKey + prm, attempts);
export const incrementFailedRefreshAttempts: (prm: string) => number = (prm) => {
    const attempts = getFailedRefreshAttempts(prm);
    store.set(failedRefreshAttemptsKey + prm, attempts + 1);
    return attempts + 1;
};
export const setSandbox = (sandbox: boolean) => store.set(sandboxStoreKey, sandbox);
