import { getSession } from './auth.js';
import chalk from 'chalk';
import ora from 'ora';
import { mkdirp } from 'mkdirp';
import fs from 'fs';
import path from 'path';
import { type APIResponse, Session } from '../lib/index.js';
import pkg from '../package.json' assert { type: 'json' };

export type Format = 'pretty' | 'json' | 'csv';

export type MeteringFlags = {
  start: string;
  end: string;
  output?: string;
  quiet?: boolean;
  format: Format;
  prm?: string;
  token?: string;
};

export class MeteringHandler {
  session: Session;
  constructor(private flags: MeteringFlags) {
    this.session = getSession({ token: this.flags.token, prm: this.flags.prm });
    this.session.userAgent = `@bokub/linky CLI (v${pkg.version})`;
  }

  daily() {
    return this.handlePromise(
      this.session.getDailyConsumption(this.flags.start, this.flags.end),
      'Récupération de la consommation quotidienne'
    );
  }

  loadCurve() {
    return this.handlePromise(
      this.session.getLoadCurve(this.flags.start, this.flags.end),
      'Récupération de la courbe de charge'
    );
  }

  dailyProduction() {
    return this.handlePromise(
      this.session.getDailyProduction(this.flags.start, this.flags.end),
      'Récupération de la production quotidienne'
    );
  }

  loadCurveProduction() {
    return this.handlePromise(
      this.session.getProductionLoadCurve(this.flags.start, this.flags.end),
      'Récupération de la courbe de charge de production'
    );
  }

  maxPower() {
    return this.handlePromise(
      this.session.getMaxPower(this.flags.start, this.flags.end),
      'Récupération de la puissance maximale quotidienne'
    );
  }

  handlePromise(promise: Promise<APIResponse>, spinnerText: string) {
    const spinner = ora({ isSilent: this.flags.quiet }).start(spinnerText);

    return promise
      .then(async (response) => {
        if (this.flags.output) {
          try {
            await mkdirp(path.dirname(this.flags.output));
            const chalkLevel = chalk.level;
            chalk.level = 0;
            fs.writeFileSync(this.flags.output, render(this.flags.format, response));
            chalk.level = chalkLevel;
          } catch (e) {
            throw new Error(`Impossible d'écrire dans ${this.flags.output}:\n${(e as Error).message}`);
          }
        }

        spinner.succeed();

        if (this.flags.output) {
          ora({ isSilent: this.flags.quiet }).succeed(`Résultats sauvegardés dans ${this.flags.output}`);
        }

        if (!this.flags.output) {
          console.info('\n' + render(this.flags.format, response));
        }
      })
      .catch((e) => {
        spinner.stop();
        ora(e.message).fail();
        if (e.code) {
          ora('Code: ' + e.code).fail();
        }
        if (e.response) {
          ora('Réponse: ' + JSON.stringify(e.response, null, 4)).fail();
        }
        throw new Error();
      });
  }
}

function render(format: Format, response: APIResponse): string {
  switch (format) {
    case 'json':
      return JSON.stringify(response, null, 2);

    case 'csv':
      return `Date,Valeur (${response.reading_type.unit})
${response.interval_reading.map((x: { date: string; value: string }) => `${x.date},${x.value}`).join('\n')}`;

    case 'pretty': {
      const maxValue = Math.max(...response.interval_reading.map((x) => +x.value));
      const displayTime = response.reading_type.measurement_kind !== 'energy';
      const chartLength = 30;
      return (
        // Headers
        [
          chalk.yellow.underline(`Date${' '.repeat(displayTime ? 16 : 7)}`),
          chalk.green.underline(`Valeur (${response.reading_type.unit})`),
          chalk.cyan.underline(`Graphique${' '.repeat(chartLength - 9)}`),
        ].join(' ') +
        '\n' +
        response.interval_reading
          .map(
            (line) =>
              // Data
              chalk.yellow(`${line.date}  `) +
              chalk.green(`${line.value}`) +
              ' '.repeat(10 + response.reading_type.unit.length - line.value.toString().length) +
              chalk.cyan('■'.repeat(maxValue && line.value ? Math.ceil((chartLength * +line.value) / maxValue) : 0))
          )
          .join('\n')
      );
    }
    default:
      ora(`Le format "${format}" est invalide. Formats acceptés: "pretty", "json", "csv".`).fail();
      return '';
  }
}
