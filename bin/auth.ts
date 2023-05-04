import { Session } from '../lib/index.js';
import * as store from './store.js';
import chalk from 'chalk';

export function auth(token: string | undefined) {
  if (!token) {
    console.error(
      chalk.yellow("L'authentification nécessite un token:\n") +
        chalk.cyan('    --token     ou   -t\n') +
        chalk.green('Pour en obtenir un, rendez-vous sur https://conso.boris.sh')
    );
    throw new Error();
  }

  try {
    new Session(token);
  } catch (e) {
    console.error(chalk.yellow((e as Error).message));
    throw new Error();
  }

  store.saveToken(token);

  console.info(chalk.green('Votre token a été sauvegardé avec succès'));
}

export function getSession({ token, prm }: { token?: string | undefined; prm?: string | undefined }): Session {
  token = token || store.getToken();

  if (!token) {
    throw new Error(
      "Vous n'avez aucun token enregistré.\nLancez 'linky auth' pour vous connecter ou renseignez le paramètre --token"
    );
  }

  return new Session(token, prm);
}
