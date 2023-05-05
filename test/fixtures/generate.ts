import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { APIError, Session } from '../../lib/index.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prettier from 'prettier';

dotenv.config({ path: '.env' });

let fixtures = `const nock = require('nock');

if(process.env.RECORDING){return}

/* THIS FILE HAS BEEN GENERATED WITH npm run generate-fixtures */

nock('https://conso.boris.sh')
  .get(/99999999999999/)
  .reply(401, { "status": 401, "message": "Votre token est invalide ou ne permet pas d'accéder à ce PRM" })
  .persist();

`;

const dates: { [key: string]: string[][] } = {
  daily_consumption: [
    ['2023-04-02', '2023-04-01'],
    ['2023-04-01', '2023-04-04'],
    ['2023-04-01', '2023-04-02'],
  ],
  consumption_load_curve: [['2023-04-01', '2023-04-02']],
  consumption_max_power: [
    ['2023-04-01', '2023-04-04'],
    ['2023-04-01', '2023-04-02'],
  ],
  daily_production: [
    ['2023-04-01', '2023-04-04'],
    ['2023-04-01', '2023-04-02'],
  ],
  production_load_curve: [['2023-04-01', '2023-04-02']],
};

const consumptionSession: Session = new Session(process.env.CONSUMPTION_TOKEN as string);
const productionSession: Session = new Session(process.env.PRODUCTION_TOKEN as string);

for (const key in dates) {
  for (const [start, end] of dates[key]) {
    fixtures += `nock('https://conso.boris.sh').get(/api\\/${key}\\?start=${start}&end=${end}/)`;
    try {
      let result: any = {};
      switch (key) {
        case 'daily_consumption':
          result = await consumptionSession.getDailyConsumption(start, end);
          break;
        case 'consumption_load_curve':
          result = await consumptionSession.getLoadCurve(start, end);
          break;
        case 'consumption_max_power':
          result = await consumptionSession.getMaxPower(start, end);
          break;
        case 'daily_production':
          result = await productionSession.getDailyProduction(start, end);
          break;
        case 'production_load_curve':
          result = await productionSession.getProductionLoadCurve(start, end);
          break;
      }
      result.usage_point_id = '12345123451234';
      fixtures += `.reply(200, ${JSON.stringify(result)}).persist();\n\n`;
      console.info(`saved response 200 for ${key} from ${start} to ${end}`);
    } catch (e) {
      fixtures += `.reply(${(e as APIError).code}, ${JSON.stringify((e as APIError).response)}).persist();\n\n`;
      console.info(`saved response ${(e as APIError).code} for ${key} from ${start} to ${end}`);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dest = join(__dirname, 'fixtures.cjs');

const config = await prettier.resolveConfig(
  readFileSync(join(__dirname, '../../node_modules/@bokub/prettier-config/index.json'), 'utf8')
);

writeFileSync(dest, prettier.format(fixtures, config as any));
