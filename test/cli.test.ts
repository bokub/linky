import { node } from 'execa';
import jwt from 'jsonwebtoken';
import { getToken } from '../bin/store.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
process.env.FORCE_COLOR = '0';
const CONSUMPTION_TOKEN = process.env.CONSUMPTION_TOKEN;
const PRODUCTION_TOKEN = process.env.PRODUCTION_TOKEN;

const bin = './bin/cli.ts';
const linky = (args: string) =>
  node(bin, args.split(' '), { nodeOptions: ['--experimental-vm-modules', '--loader=ts-node/esm'] });

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
      const { stdout } = await linky(`auth -t ${token}`);
      expect(getToken()).toEqual(token);
      expect(stdout).toMatch('Votre token a été sauvegardé avec succès');
    });
  });

  describe('daily command', () => {
    it('should display API errors', async () => {
      expect.assertions(1);
      await linky(`auth -t ${CONSUMPTION_TOKEN}`);
      try {
        await linky(`daily -s 2023-04-02 -e 2023-04-01`);
      } catch (e) {
        expect((e as Error).message).toMatch('Start date should be before end date');
      }
    });

    it('should bypass the saved token when there is a token parameter', async () => {
      expect.assertions(2);
      await linky(`auth -t ${jwt.sign({ sub: ['12345123451234'] }, 'secret')}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02`);
      } catch (e) {
        expect((e as Error).message).toMatch('Votre token est invalide');
      }

      await expect(linky(`daily -s 2023-04-01 -e 2023-04-02 -t ${CONSUMPTION_TOKEN}`)).resolves.toBeTruthy();
    });

    it('should throw an error when the PRM cannot be accessed', async () => {
      expect.assertions(1);
      await linky(`auth -t ${jwt.sign({ sub: ['12345123451234'] }, 'secret')}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02 -p 88888999990000`);
      } catch (e) {
        expect((e as Error).message).toMatch("Ce token ne permet pas d'accéder au PRM");
      }
    });

    it('should use the first of multiple PRMs', async () => {
      expect.assertions(1);
      await linky(`auth -t ${jwt.sign({ sub: ['12345123451234', '1', '123'] }, 'secret')}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02`);
      } catch (e) {
        expect((e as Error).message).toMatch('"status": 401');
      }
    });

    it('should use another PRM is there is a prm parameter', async () => {
      expect.assertions(1);
      await linky(`auth -t ${jwt.sign({ sub: ['12345123451234', '1', '123'] }, 'secret')}`);
      try {
        await linky(`daily -s 2023-04-01 -e 2023-04-02 --prm 123`);
      } catch (e) {
        expect((e as Error).message).toMatch('"status": 400');
      }
    });

    // TODO test output, format, quiet
  });

  describe('consumption command', () => {
    beforeAll(async () => {
      await linky(`auth -t ${CONSUMPTION_TOKEN}`);
    });
    test.each(['daily', 'loadcurve', 'maxpower'])('"%s" should display a graph', async (command) => {
      const { stdout } = await linky(`${command} -s 2023-04-01 -e 2023-04-02`);
      expect(stdout).toMatchSnapshot();
    });
  });

  describe('production command', () => {
    beforeAll(async () => {
      await linky(`auth -t ${PRODUCTION_TOKEN}`);
    });
    test.each(['dailyprod', 'loadcurveprod'])('"%s" should display a graph', async (command) => {
      const { stdout } = await linky(`${command} -s 2023-04-01 -e 2023-04-02`);
      expect(stdout).toMatchSnapshot();
    });
  });
});
