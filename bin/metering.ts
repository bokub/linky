import { getSession } from './auth.js';
import chalk from 'chalk';
import ora from 'ora';
import { mkdirp } from 'mkdirp';
import fs from 'fs';
import path from 'path';
import { type APIResponse, Session } from '../lib/index.js';
import { pkg } from './pkg.js';

export type Format = 'pretty' | 'json' | 'csv';

export type MeteringFlags = {
  start: string;
  end: string;
  output?: string;
  quiet?: boolean;
  format: Format;
  prm?: string;
  token?: string;
  pas?: string;
  grandeurPhysique?: string;
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
      this.session.getMaxPower(this.flags.start, this.flags.end, this.flags.pas, this.flags.grandeurPhysique),
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
  const points = response.grandeur.flatMap((grandeur) =>
    grandeur.points.map((point) => ({ date: point.d, value: point.v, unit: grandeur.unite }))
  );
  const invalidPoints = points.filter((point) => point.value === null || !Number.isFinite(Number(point.value)));
  invalidPoints.forEach((point) => {
    console.warn(`Valeur non numérique reçue pour ${point.date} : ${JSON.stringify(point.value)}`);
  });
  const numericValues = points
    .filter((point) => point.value !== null && Number.isFinite(Number(point.value)))
    .map((point) => Number(point.value));

  switch (format) {
    case 'json':
      return JSON.stringify(response, null, 2);

    case 'csv':
      return `Date,Valeur (${points[0]?.unit ?? ''})
${points.map((point) => `${point.date},${point.value}`).join('\n')}`;

    case 'pretty': {
      const maxValue = Math.max(0, ...numericValues);
      const dateWidth = points.length ? Math.max(...points.map((point) => point.date.length)) : 10;
      const chartLength = 30;
      const chalkLevel = chalk.level;
      if (!color) {
        chalk.level = 0;
      }
      const result =
        // Headers
        [
          chalk.yellow.underline(`Date${' '.repeat(dateWidth - 'Date'.length + 1)}`),
          chalk.green.underline(`Valeur (${points[0]?.unit ?? ''})`),
          chalk.cyan.underline(`Graphique${' '.repeat(chartLength - 9)}`),
        ].join(' ') +
        '\n' +
        points
          .map((point) =>
            // Data
            (
              chalk.yellow(`${point.date.padEnd(dateWidth)}  `) +
              chalk.green(`${point.value ?? 'null'}`) +
              ' '.repeat(10 + point.unit.length - String(point.value ?? 'null').length) +
              chalk.cyan(
                '■'.repeat(
                  maxValue && point.value !== null && Number.isFinite(Number(point.value))
                    ? Math.ceil((chartLength * Number(point.value)) / maxValue)
                    : 0
                )
              )
            ).trimEnd()
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
