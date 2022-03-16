import { Session, SessionConfig } from '../src';
import * as store from './store';
import chalk from 'chalk';

export function auth(config: SessionConfig) {
    if (!config.accessToken || !config.refreshToken || !config.usagePointId) {
        console.error(
            chalk.yellow("L'authentification nécessite 3 paramètres:\n") +
                chalk.cyan('    --access-token     ou   -a\n') +
                chalk.cyan('    --refresh-token    ou   -r\n') +
                chalk.cyan('    --usage-point-id   ou   -u\n\n') +
                chalk.green('Pour obtenir ces informations, rendez-vous sur https://conso.vercel.app')
        );
        throw new Error();
    }
    store.setAccessToken(config.accessToken);
    store.setRefreshToken(config.refreshToken);
    store.setUsagePointID(config.usagePointId);
    store.setSandbox(config.sandbox || false);

    console.info(chalk.green('Vos tokens ont été sauvegardés avec succès'));
}

export function getSession(): Session {
    const accessToken = store.getAccessToken();
    const refreshToken = store.getRefreshToken();
    const usagePointId = store.getUsagePointID();

    if (!accessToken || !refreshToken || !usagePointId) {
        throw new Error("Vous n'êtes pas connecté à votre compte Enedis\nLancez 'linky auth' pour vous connecter");
    }

    return new Session({
        accessToken,
        refreshToken,
        usagePointId,
        sandbox: store.getSandbox(),
        onTokenRefresh: (accessToken, refreshToken) => {
            if (accessToken && refreshToken) {
                store.setAccessToken(accessToken);
                store.setRefreshToken(refreshToken);
                store.setFailedRefreshAttempts(0);
                return;
            }

            let failedRefreshAttempts = store.incrementFailedRefreshAttempts();
            // If it failed less than 3 times, just print a warning
            if (failedRefreshAttempts < 3) {
                throw new Error(
                    "Impossible de rafraichir vos tokens...\nVeuillez réessayer plus tard ou relancez 'linky auth' avec de nouveaux tokens"
                );
            }
            // If it failed 3 times or more, reset tokens
            store.setAccessToken(accessToken);
            store.setRefreshToken(refreshToken);
            store.setFailedRefreshAttempts(0);
            throw new Error(
                "Impossible de rafraichir vos tokens...\nVos tokens sont invalides et ont été supprimés\nRelancez 'linky auth' pour vous connecter"
            );
        },
    });
}
