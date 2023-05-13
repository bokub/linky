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
        spinner.succeed();

        const rendered = render(this.flags.format, !this.flags.output, response);

        if (this.flags.output) {
          try {
            await mkdirp(path.dirname(this.flags.output));
            fs.writeFileSync(this.flags.output, rendered);
          } catch (e: any) {
            ora().fail(`Impossible d'écrire dans ${this.flags.output}`);
            if (e.message) {
              ora().fail('Erreur : ' + e.message);
            }
            throw new Error();
          }
          ora({ isSilent: this.flags.quiet }).succeed(`Résultats sauvegardés dans ${this.flags.output}`);
        } else {
          console.info('\n' + rendered);
        }
      })
      .catch((e) => {
        spinner.stop();
        if (e.message) {
          ora().fail(e.message);
        }
        if (e.code) {
          ora().fail('Code : ' + e.code);
        }
        if (e.response) {
          ora().fail('Réponse : ' + JSON.stringify(e.response, null, 4));
        }
        throw new Error();
      });
  }
}

function render(format: Format, color: boolean, response: APIResponse): string {
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
      const chalkLevel = chalk.level;
      if (!color) {
        chalk.level = 0;
      }
      const result =
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
          .join('\n');
      chalk.level = chalkLevel;
      return result;
    }
    default:
      ora().fail(`Le format "${format}" est invalide`);
      ora().info(`Formats acceptés: "pretty", "json", "csv"`);
      throw new Error();
  }
}
