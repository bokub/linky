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
        --output    -o    Fichier .json de sortie. Optionnel
        
    Exemples:
      linky auth -a Kft3SIZrcq -r F3AR0K8eoC -u 225169
      linky daily --start 2020-08-01 --end 20202-08-15
      linky loadcurve -s 2020-09-01 -e 2020-09-02 -o data/ma_conso.json
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
            output: { type: 'string', alias: 'o' },
            sandbox: { type: 'boolean' }, // For test purposes
        },
    });
} catch (e) {
    exit(e);
    process.exit(1);
}

const meteringFlags: MeteringFlags = {
    start: cli.flags.start || '',
    end: cli.flags.end || '',
    output: cli.flags.output || null,
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
        try {
            daily(meteringFlags).catch((e) => exit(e));
        } catch (e) {
            exit(e);
        }
        break;
    case loadCurveCommand:
        try {
            loadCurve(meteringFlags).catch((e) => exit(e));
        } catch (e) {
            exit(e);
        }
        break;
    case maxPowerCommand:
        try {
            maxPower(meteringFlags).catch((e) => exit(e));
        } catch (e) {
            exit(e);
        }
        break;
    default:
        cli.showHelp();
}
