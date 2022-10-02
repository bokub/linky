import { getSession } from './auth';
import { Consumption } from '../src';
import * as store from './store';
import chalk from 'chalk';
import ora from 'ora';
import mkdirp from 'mkdirp';
import fs from 'fs';
import path from 'path';

export type Format = 'json' | 'pretty';

export type MeteringFlags = {
    start: string;
    end: string;
    output: string | null;
    quiet: boolean;
    format: Format;
    usagePointId?: string;
};

export function daily(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getDailyConsumption(flags.start, flags.end),
        'Récupération de la consommation quotidienne',
        false,
        flags.output,
        flags.quiet,
        flags.format,
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
        flags.quiet,
        flags.format,
        flags.usagePointId
    );
}

export function dailyProduction(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getDailyProduction(flags.start, flags.end),
        'Récupération de la production quotidienne',
        false,
        flags.output,
        flags.quiet,
        flags.format
    );
}

export function loadCurveProduction(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getProductionLoadCurve(flags.start, flags.end),
        'Récupération de la courbe de charge de production',
        true,
        flags.output,
        flags.quiet,
        flags.format
    );
}

export function maxPower(flags: MeteringFlags) {
    const session = getSession(flags.usagePointId);
    return handle(
        session.getMaxPower(flags.start, flags.end),
        'Récupération de la puissance maximale quotidienne',
        true,
        flags.output,
        flags.quiet,
        flags.format,
        flags.usagePointId
    );
}

function handle(
    promise: Promise<Consumption>,
    spinnerText: string,
    displayTime: boolean,
    output: string | null,
    quiet: boolean,
    format: Format,
    usagePointId?: string
) {
    const session = store.getStoredSession(usagePointId);
    const previousAccessToken = session?.accessToken;

    const spinner = ora();
    if (!quiet) spinner.start(spinnerText);

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

            if (!quiet) {
                spinner.succeed();

                if (store.getStoredSession(session?.usagePointId)?.accessToken !== previousAccessToken) {
                    ora('Vos tokens ont été automatiquement renouvelés').succeed();
                }

                if (output) {
                    ora(`Résultats sauvegardés dans ${output}`).succeed();
                }
            }

            if (!output) {
                render(format, consumption, displayTime);
            }
        })
        .catch((e) => {
            spinner.fail(e.message);
            throw new Error();
        });
}

function render(format: Format, ...args: [Consumption, boolean]) {
    Rendered[format](...args);
}

const Rendered = {
    json(consumption: Consumption, displayTime: boolean) {
        console.log(JSON.stringify(consumption, null, 2));
    },
    pretty(consumption: Consumption, displayTime: boolean) {
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
                    chalk.cyan(
                        '■'.repeat(maxValue && line.value ? Math.ceil((chartLength * line.value) / maxValue) : 0)
                    )
            );
        }
    },
};
