import { node } from 'execa';
import jwt from 'jsonwebtoken';
import { getToken, saveToken } from '../bin/store.js';
import { readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

process.env.FORCE_COLOR = '0';

const bin = './bin/cli.ts';
const linky = (args: string) =>
  node(bin, args.split(' '), { nodeOptions: ['--experimental-vm-modules', '--loader=ts-node/esm'] });

const validToken = jwt.sign({ sub: ['11111111111111'] }, 'secret');
const invalidToken = jwt.sign({ sub: ['99999999999999'] }, 'secret');

describe('cli', () => {
  describe('auth', () => {
    it('should return an error when the token parameter is missing', async () => {
      expect.assertions(1);
      try {
        await linky('auth');
      } catch (e) {
        expect((e as Error).message).toMatch("L'authentification nécessite un token");
      }
    });

    it('should return an error when the token is invalid', async () => {
      expect.assertions(1);
      try {
        await linky('auth -t invalid-token');
      } catch (e) {
        expect((e as Error).message).toMatch('Le token est invalide');
      }
    });

    it('should return an error when the token sub is not an array', async () => {
      expect.assertions(1);
      try {
        await linky(`auth -t ${jwt.sign({ sub: '123' }, 'secret')}`);
      } catch (e) {
        expect((e as Error).message).toMatch('Le token est invalide');
      }
    });

    it('should return an error when the token contains no PRM', async () => {
      expect.assertions(1);
      try {
        await linky(`auth -t ${jwt.sign({ sub: [] }, 'secret')}`);
      } catch (e) {
        expect((e as Error).message).toMatch('Le token est invalide');
      }
    });

    it('should save a token in the store', async () => {
      const token = jwt.sign({ sub: ['1'] }, 'secret');
      await linky(`auth -t ${token}`);
      expect(getToken()).toEqual(token);
    });
  });

  describe('daily command', () => {
    it('should throw when not logged', async () => {
      expect.assertions(1);
      saveToken('');
      try {
        await linky(`daily -s 2023-04-02 -e 2023-04-01`);
      } catch (e) {
        expect((e as Error).message).toMatch("Vous n'avez aucun token enregistré");
      }
    });

    it('should display API errors', async () => {
      expect.assertions(2);
      await linky(`auth -t ${validToken}`);
      try {
        await linky(`daily -s 2023-04-02 -e 2023-04-01`);
      } catch (e) {
        expect((e as Error).message).toMatch('"status": 400');
        expect((e as Error).message).toMatch('Start date should be before end date');
      }
    });

    it('should bypass the saved token when there is a token parameter', async () => {
      expect.assertions(2);
      await linky(`auth -t ${invalidToken}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02`);
      } catch (e) {
        expect((e as Error).message).toMatch('"status": 401');
      }

      await expect(linky(`daily -s 2023-04-01 -e 2023-04-02 -t ${validToken}`)).resolves.toBeTruthy();
    });

    it('should throw an error when the PRM cannot be accessed', async () => {
      expect.assertions(1);
      await linky(`auth -t ${validToken}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02 -p 22222222222222`);
      } catch (e) {
        expect((e as Error).message).toMatch("Ce token ne permet pas d'accéder au PRM");
      }
    });

    it('should use the first of multiple PRMs', async () => {
      expect.assertions(1);
      await linky(`auth -t ${invalidToken}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02`);
      } catch (e) {
        expect((e as Error).message).toMatch('"status": 401');
      }
    });

    it('should use another PRM is there is a prm parameter', async () => {
      expect.assertions(1);
      await linky(`auth -t ${jwt.sign({ sub: ['11111111111111', '22222222222222', '99999999999999'] }, 'secret')}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02 --prm 99999999999999`);
      } catch (e) {
        expect((e as Error).message).toMatch('"status": 401');
      }
    });

    it('should output JSON when --format=json', async () => {
      await linky(`auth -t ${validToken}`);
      const { stdout } = await linky(`daily -s 2023-04-01 -e 2023-04-02 --format json`);
      expect(stdout).toMatchSnapshot();
      expect(JSON.parse(stdout).interval_reading).toBeInstanceOf(Array);
    });

    it('should output CSV with 2 columns when --format=csv', async () => {
      await linky(`auth -t ${validToken}`);
      const { stdout } = await linky(`daily -s 2023-04-01 -e 2023-04-02 --format csv`);
      expect(stdout).toMatchSnapshot();
      expect(stdout.split('\n').every((line) => line.split(',').length === 2));
    });

    it('should throw an error if the format is invalid', async () => {
      expect.assertions(1);
      await linky(`auth -t ${validToken}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02 --format xml`);
      } catch (e) {
        expect((e as Error).message).toMatch('Le format "xml" est invalide');
      }
    });

    it('should create directory and write to file when output flag is used ', async () => {
      await linky(`auth -t ${validToken}`);
      const outputPath = join(tmpdir(), (Math.random() + 1).toString(36).substring(2), 'output.json');
      const { stdout } = await linky(`daily -s 2023-04-01 -e 2023-04-02 --output ${outputPath} --format json`);
      expect(stdout).toBe('');

      const fileContent = readFileSync(outputPath, 'utf8');
      expect(fileContent).toMatchSnapshot();
    });

    it('should throw an error if the output path is invalid', async () => {
      expect.assertions(1);
      await linky(`auth -t ${validToken}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02 --output / --format json`);
      } catch (e) {
        expect((e as Error).message).toMatch("Impossible d'écrire dans /");
      }
    });
  });

  describe('command', () => {
    beforeAll(async () => {
      await linky(`auth -t ${validToken}`);
    });
    test.each(['daily', 'loadcurve', 'maxpower', 'dailyprod', 'loadcurveprod'])(
      '"%s" should display a graph',
      async (command) => {
        const { stdout } = await linky(`${command} -s 2023-04-01 -e 2023-04-02`);
        expect(stdout).toMatchSnapshot();
      }
    );
  });
});
