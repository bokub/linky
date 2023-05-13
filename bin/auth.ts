import { Session } from '../lib/index.js';
import * as store from './store.js';
import ora from 'ora';

export function auth(token: string | undefined) {
  if (!token) {
    ora().fail("L'authentification nécessite un token");
    ora().info('Pour en obtenir un, rendez-vous sur https://conso.boris.sh');
    throw new Error();
  }

  try {
    new Session(token);
  } catch (e: any) {
    if (e.message) {
      ora().fail(e.message);
    }
    throw new Error();
  }

  store.saveToken(token);

  ora().succeed('Token sauvegardé avec succès');
}

export function getSession({ token, prm }: { token?: string | undefined; prm?: string | undefined }): Session {
  token = token || store.getToken();

  if (!token) {
    ora().fail("Vous n'avez aucun token enregistré");
    ora().info("Lancez 'linky auth' pour vous connecter ou renseignez le paramètre --token");

    throw new Error();
  }

  return new Session(token, prm);
}
