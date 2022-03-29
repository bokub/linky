import { getSession } from './auth';
import { Consumption } from '../src';
import * as store from './store';
import chalk from 'chalk';
import ora from 'ora';
import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';
import { getLastUsagePointID } from './store';

export type MeteringFlags = {
    start: string;
    end: string;
    output: string | null;
    usagePointId?: string;
};

export function daily(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getDailyConsumption(flags.start, flags.end),
        'Récupération de la consommation quotidienne',
        false,
        flags.output,
        flags.usagePointId
    );
}

export function loadCurve(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getLoadCurve(flags.start, flags.end),
        'Récupération de la courbe de charge',
        true,
        flags.output,
        flags.usagePointId
    );
}

export function maxPower(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getMaxPower(flags.start, flags.end),
        'Récupération de la puissance maximale quotidienne',
        true,
        flags.output,
        flags.usagePointId
    );
}

function handle(
    promise: Promise<Consumption>,
    spinnerText: string,
    displayTime: boolean,
    output: string | null,
    prm?: string
) {
    const usagePointId = prm ?? getLastUsagePointID();

    const spinner = ora().start(spinnerText);
    const previousAccessToken = store.getAccessToken(usagePointId);

    return promise
        .then(async (consumption) => {
            if (output) {
                try {
                    await mkdirp(path.dirname(output));
                    fs.writeFileSync(output, JSON.stringify(consumption, null, 4));
                } catch (e) {
                    throw new Error(`Impossible d'écrire dans ${output}:\n${e.message}`);
                }
            }
            spinner.succeed();

            if (store.getAccessToken(usagePointId) !== previousAccessToken) {
                ora('Vos tokens ont été automatiquement renouvelés').succeed();
            }

            if (output) {
                ora(`Résultats sauvegardés dans ${output}`).succeed();
            }

            display(consumption, displayTime);
        })
        .catch((e) => {
            spinner.fail(e.message);
            throw new Error();
        });
}

function display(consumption: Consumption, displayTime: boolean) {
    const maxValue = Math.max(...consumption.data.map((x) => x.value));
    const chartLength = 30;
    // Headers
    console.info(
        '\n' +
            chalk.yellow.underline(`Date${' '.repeat(displayTime ? 16 : 7)}`) +
            ' ' +
            chalk.green.underline(`Valeur (${consumption.unit})`) +
            ' ' +
            chalk.cyan.underline(`Graphique${' '.repeat(chartLength - 9)}`)
    );

    for (const line of consumption.data) {
        console.info(
            chalk.yellow(`${line.date}  `) +
                chalk.green(`${line.value}`) +
                ' '.repeat(10 + consumption.unit.length - line.value.toString().length) +
                chalk.cyan('■'.repeat(maxValue && line.value ? Math.ceil((chartLength * line.value) / maxValue) : 0))
        );
    }
}
