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
    store.saveSession(config.usagePointId, config.accessToken, config.refreshToken, config.sandbox || false);
    store.setLastUsagePointId(config.usagePointId);
    console.info(chalk.green('Vos tokens ont été sauvegardés avec succès'));
}

export function getSession(usagePointId?: string): Session {
    const storedSession = store.getStoredSession(usagePointId);

    if (usagePointId) {
        store.setLastUsagePointId(usagePointId);
    }

    if (!storedSession || !storedSession.accessToken || !storedSession.accessToken) {
        throw new Error("Vous n'êtes pas connecté à votre compte Enedis\nLancez 'linky auth' pour vous connecter");
    }

    return new Session({
        ...storedSession,
        onTokenRefresh: (accessToken, refreshToken) => {
            if (accessToken && refreshToken) {
                store.saveSession(storedSession.usagePointId, accessToken, refreshToken);
                return;
            }

            let failedRefreshAttempts = store.incrementFailedRefreshAttempts(storedSession.usagePointId);
            // If it failed less than 3 times, just print a warning
            if (failedRefreshAttempts < 3) {
                throw new Error(
                    "Impossible de rafraichir vos tokens...\nVeuillez réessayer plus tard ou relancez 'linky auth' avec de nouveaux tokens"
                );
            }
            // If it failed 3 times or more, reset tokens
            store.deleteSession(storedSession.usagePointId);
            throw new Error(
                "Impossible de rafraichir vos tokens...\nVos tokens sont invalides et ont été supprimés\nRelancez 'linky auth' pour vous connecter"
            );
        },
    });
}
