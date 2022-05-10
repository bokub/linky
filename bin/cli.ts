#!/usr/bin/env node

import meow from 'meow';
import { auth } from './auth';
import {daily, dailyProduction, loadCurve, loadCurveProduction, maxPower, MeteringFlags} from './metering';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';
import dayjs from 'dayjs';

import * as pkg from '../package.json';

function exit(e: Error) {
    if (e.message) {
        console.error(chalk.yellow(e.message));
    }
    process.exit(1);
}

const mainHelp = `
    linky <commande> [options]
    
    Commandes:
      linky auth            Crée une connexion à un compte Enedis. Vous pouvez obtenir vos tokens sur https://conso.vercel.app
      linky daily           Récupère la consommation quotidienne
      linky loadcurve       Récupère la puissance moyenne consommée quotidiennement, sur un intervalle de 30 min
      linky maxpower        Récupère la puissance maximale de consommation atteinte quotidiennement
      linky dailyprod       Récupère la production quotidienne
      linky loadcurveprod   Récupère la puissance moyenne produite quotidiennement, sur un intervalle de 30 min
    
    Options:
      linky auth:
        --access-token      -a    Access Token
        --refresh-token     -r    Refresh Token
        --usage-point-id    -u    Usage Point ID

      linky (daily|loadcurve|maxpower):
        --start     -s    Date de début (AAAA-MM-JJ). Par défaut: hier
        --end       -e    Date de début (AAAA-MM-JJ). Par défaut: aujourd'hui
        --output    -o    Fichier .json de sortie. Optionnel
        
    Exemples:
      linky auth -a Kft3SIZrcq -r F3AR0K8eoC -u 225169
      linky daily --start 2022-01-01 --end 2022-01-08
      linky maxpower --start 2021-08-01 --end 2021-08-15
      linky loadcurve -s 2022-01-01 -e 2022-01-08 -o data/ma_conso.json
      linky daily
`;

const authCommand = 'auth';
const dailyConsumptionCommand = 'daily';
const dailyProductionCommand = 'dailyprod';
const loadCurveCommand = 'loadcurve';
const loadCurveProductionCommand = 'loadcurveprod';
const maxPowerCommand = 'maxpower';


const today = dayjs().format('YYYY-MM-DD');
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

let cli;
try {
    cli = meow(mainHelp, {
        description: false,
        flags: {
            accessToken: { type: 'string', alias: 'a' },
            refreshToken: { type: 'string', alias: 'r' },
            usagePointId: { type: 'string', alias: 'u' },
            start: { type: 'string', alias: 's', default: yesterday },
            end: { type: 'string', alias: 'e', default: today },
            output: { type: 'string', alias: 'o' },
            sandbox: { type: 'boolean' }, // For test purposes
        },
    });
} catch (e) {
    exit(e);
    process.exit(1);
}

const meteringFlags: MeteringFlags = {
    start: cli.flags.start,
    end: cli.flags.end,
    output: cli.flags.output || null,
};

const notifier = updateNotifier({ pkg });
notifier.notify({
    message:
        'Mise à jour disponible: ' +
        chalk.dim('{currentVersion}') +
        chalk.reset(' → ') +
        chalk.green('{latestVersion}') +
        ' \nLancez ' +
        chalk.cyan('npm i -g linky') +
        ' pour mettre à jour',
});

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
    case dailyProductionCommand:
        try {
            dailyProduction(meteringFlags).catch((e) => exit(e));
        } catch (e) {
            exit(e);
        }
        break;
    case loadCurveProductionCommand:
        try {
            loadCurveProduction(meteringFlags).catch((e) => exit(e));
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
