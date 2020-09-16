import { Session, SessionConfig } from '../src';
import Conf from 'conf';
import chalk from 'chalk';

const store = new Conf();

export function auth(config: SessionConfig) {
    if (!config.accessToken || !config.refreshToken || !config.usagePointId) {
        console.error(
            chalk.yellow("L'authentification nécessite 3 paramètres:\n") +
                chalk.cyan('    --access-token     ou   -a\n') +
                chalk.cyan('    --refresh-token    ou   -r\n') +
                chalk.cyan('    --usage-point-id   ou   -u\n\n') +
                chalk.green('Pour obtenir ces informations, rendez-vous sur https://linky-auth.vercel.app')
        );
        throw new Error();
    }
    store.set('linky/accessToken', config.accessToken);
    store.set('linky/refreshToken', config.refreshToken);
    store.set('linky/usagePointId', config.usagePointId);
    store.set('linky/sandbox', config.sandbox);

    console.info(chalk.green('Vos tokens ont été sauvegardés avec succès'));
}

export function getSession(): Session {
    const accessToken = store.get('linky/accessToken', '') as string;
    const refreshToken = store.get('linky/refreshToken', '') as string;
    const usagePointId = store.get('linky/usagePointId', '') as string;

    if (!accessToken || !refreshToken || !usagePointId) {
        throw new Error("Vous n'êtes pas connecté à votre compte Enedis\nLancez 'linky auth' pour vous connecter");
    }

    return new Session({
        accessToken,
        refreshToken,
        usagePointId,
        sandbox: Boolean(store.get('linky/sandbox', false)),
        onTokenRefresh: (accessToken, refreshToken) => {
            store.set('linky/accessToken', accessToken);
            store.set('linky/refreshToken', refreshToken);
        },
    });
}
