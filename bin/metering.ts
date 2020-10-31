import { getSession } from './auth';
import { Consumption } from '../src';
import * as store from './store';
import chalk from 'chalk';
import ora from 'ora';
import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';

export type MeteringFlags = {
    start: string;
    end: string;
    output: string | null;
};

export function daily(flags: MeteringFlags) {
    const session = getSession();
    return handle(
        session.getDailyConsumption(flags.start, flags.end),
        'Récupération de la consommation quotidienne',
        false,
        flags.output
    );
}

export function loadCurve(flags: MeteringFlags) {
    const session = getSession();
    return handle(
        session.getLoadCurve(flags.start, flags.end),
        'Récupération de la courbe de charge',
        true,
        flags.output
    );
}

export function maxPower(flags: MeteringFlags) {
    const session = getSession();
    return handle(
        session.getMaxPower(flags.start, flags.end),
        'Récupération de la puissance maximale quotidienne',
        true,
        flags.output
    );
}

function handle(promise: Promise<Consumption>, spinnerText: string, displayTime: boolean, output: string | null) {
    const spinner = ora().start(spinnerText);
    const previousAccessToken = store.getAccessToken();

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

            if (store.getAccessToken() !== previousAccessToken) {
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
