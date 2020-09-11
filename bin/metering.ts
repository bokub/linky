import { getSession } from './auth';
import { Consumption } from '../src';
import chalk from 'chalk';
import ora from 'ora';

export type MeteringFlags = {
    start: string;
    end: string;
};

export function daily(flags: { start: string; end: string }) {
    const session = getSession();
    return handle(
        session.getDailyConsumption(flags.start, flags.end),
        'Récupération de la consommation quotidienne',
        false
    );
}

export function loadCurve(flags: { start: string; end: string }) {
    const session = getSession();
    return handle(session.getLoadCurve(flags.start, flags.end), 'Récupération de la courbe de charge', true);
}

export function maxPower(flags: { start: string; end: string }) {
    const session = getSession();
    return handle(
        session.getMaxPower(flags.start, flags.end),
        'Récupération de la puissance maximale quotidienne',
        true
    );
}

function handle(promise: Promise<Consumption>, spinnerText: string, displayTime: boolean) {
    const spinner = ora().start(spinnerText);
    return promise
        .then((consumption) => {
            spinner.succeed();
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
