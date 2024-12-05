import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageJSONPaths = ['../../package.json', '../package.json'].map((p) =>
  join(dirname(fileURLToPath(import.meta.url)), p)
);

let packageJSONContent = 'package.json not found';

try {
  packageJSONContent = fs.readFileSync(packageJSONPaths[0], 'utf8');
} catch (err) {
  packageJSONContent = fs.readFileSync(packageJSONPaths[1], 'utf8');
}

export const pkg = JSON.parse(packageJSONContent);
