import Conf from 'conf';

const SESSIONS = 'sessions';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const FAILED_REFRESH_ATTEMPTS = 'failedRefreshAttempts';
const SANDBOX = 'sandbox';
const LAST_USAGE_POINT_ID = 'lastUsagePointId';

const store = new Conf({
    migrations: {
        '>=1.5.0': (store) => {
            if (store.get('linky/usagePointId')) {
                const prm = store.get('linky/usagePointId') as string;
                const sessions = {
                    [prm]: {
                        accessToken: store.get(`linky/${ACCESS_TOKEN}`, ''),
                        refreshToken: store.get(`linky/${REFRESH_TOKEN}`, ''),
                        failedRefreshAttempts: store.get(`linky/${FAILED_REFRESH_ATTEMPTS}`, 0),
                        sandbox: Boolean(store.get(`linky/${SANDBOX}`, false)),
                    },
                };
                store.clear();
                store.set(LAST_USAGE_POINT_ID, prm);
                store.set(SESSIONS, sessions);
            } else {
                store.clear();
            }
        },
    },
});

type RawStoredSession = {
    [ACCESS_TOKEN]: string;
    [REFRESH_TOKEN]: string;
    [FAILED_REFRESH_ATTEMPTS]: number;
    [SANDBOX]: boolean;
};

type StoredSession = RawStoredSession & { usagePointId: string };

export function getStoredSession(usagePointId?: string): StoredSession | null {
    if (!usagePointId) {
        usagePointId = store.get(LAST_USAGE_POINT_ID, '') as string;
    }
    if (!usagePointId) {
        return null;
    }
    const result = store.get(`${SESSIONS}.${usagePointId}`, null) as RawStoredSession | null;
    return result ? { ...result, usagePointId } : null;
}

export function saveSession(usagePointId: string, accessToken: string, refreshToken: string, sandbox?: boolean) {
    if (!usagePointId) {
        throw new Error('usage point ID cannot be empty');
    }
    store.set(`${SESSIONS}.${usagePointId}.${ACCESS_TOKEN}`, accessToken);
    store.set(`${SESSIONS}.${usagePointId}.${REFRESH_TOKEN}`, refreshToken);
    store.set(`${SESSIONS}.${usagePointId}.${FAILED_REFRESH_ATTEMPTS}`, 0);

    if (typeof sandbox === 'boolean') {
        store.set(`${SESSIONS}.${usagePointId}.${SANDBOX}`, sandbox);
    }
}

export function deleteSession(usagePointId: string) {
    store.delete(`${SESSIONS}.${usagePointId}`);
}

export function incrementFailedRefreshAttempts(usagePointId: string): number {
    if (!usagePointId) {
        throw new Error('usage point ID cannot be empty');
    }
    const attempts = store.get(`${SESSIONS}.${usagePointId}.${FAILED_REFRESH_ATTEMPTS}`, 0) as number;
    store.set(`${SESSIONS}.${usagePointId}.${FAILED_REFRESH_ATTEMPTS}`, attempts + 1);
    return attempts + 1;
}

export function setLastUsagePointId(usagePointId?: string) {
    if (!usagePointId) {
        store.delete(LAST_USAGE_POINT_ID);
    }
    store.set(LAST_USAGE_POINT_ID, usagePointId);
}
