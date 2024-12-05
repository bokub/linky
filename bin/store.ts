import Conf from 'conf';
import { pkg } from './pkg.js';

const TOKEN = 'token';

const store = new Conf({
  projectName: 'linky',
  projectVersion: pkg.version,
  migrations: {
    '>=2.0.0': (store: any) => {
      store.clear();
    },
  },
});

export function getToken() {
  return store.get(TOKEN, undefined) as string | undefined;
}

export function saveToken(token: string) {
  return store.set(TOKEN, token);
}
