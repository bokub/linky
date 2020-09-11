#!/usr/bin/env node

import meow, { IsRequiredPredicate } from 'meow';
import { auth } from './auth';
import { daily, loadCurve, maxPower, MeteringFlags } from './metering';
import chalk from 'chalk';

function exit(e: Error) {
    if (e.message) {
        console.error(chalk.yellow(e.message));
    }
    process.exit(1);
}

const mainHelp = `
    linky <commande> [options]
    
    Commandes:
      linky auth        Crée une connexion à un compte Enedis. Vous pouvez obtenir vos tokens sur https://linky-auth.vercel.app
      linky daily       Récupère la consommation quotidienne
      linky loadcurve   Récupère la puissance moyenne consommée quotidiennement, sur un intervalle de 30 min
      linky maxpower    Récupère la puissance maximale de consommation atteinte quotidiennement
    
    Options:
      linky auth:
        --access-token      -a    Access Token
        --refresh-token     -r    Refresh Token
        --usage-point-id    -u    Usage Point ID

      linky (daily|loadcurve|maxpower):
        --start     -s    Date de début (AAAA-MM-JJ)
        --end       -e    Date de début (AAAA-MM-JJ)
`;

const authCommand = 'auth';
const dailyConsumptionCommand = 'daily';
const loadCurveCommand = 'loadcurve';
const maxPowerCommand = 'maxpower';

const isMetering: IsRequiredPredicate = (flags, input) =>
    [dailyConsumptionCommand, loadCurveCommand, maxPowerCommand].indexOf(input[0]) > -1;

let cli;
try {
    cli = meow(mainHelp, {
        description: false,
        flags: {
            accessToken: { type: 'string', alias: 'a' },
            refreshToken: { type: 'string', alias: 'r' },
            usagePointId: { type: 'string', alias: 'u' },
            start: { type: 'string', alias: 's', isRequired: isMetering },
            end: { type: 'string', alias: 'e', isRequired: isMetering },
            sandbox: { type: 'boolean' }, // For test purposes
        },
    });
} catch (e) {
    exit(e);
    process.exit(1);
}

const meteringFlags: MeteringFlags = {
    start: cli.flags.start as string,
    end: cli.flags.end as string,
};

switch (cli.input[0]) {
    case authCommand:
        try {
            auth({
                accessToken: cli.flags.accessToken as string,
                refreshToken: cli.flags.refreshToken as string,
                usagePointId: cli.flags.usagePointId as string,
                sandbox: Boolean(cli.flags.sandbox),
            });
        } catch (e) {
            exit(e);
        }

        break;
    case dailyConsumptionCommand:
        daily(meteringFlags).catch((e) => exit(e));
        break;
    case loadCurveCommand:
        loadCurve(meteringFlags).catch((e) => exit(e));
        break;
    case maxPowerCommand:
        maxPower(meteringFlags).catch((e) => exit(e));
        break;
    default:
        cli.showHelp();
}
