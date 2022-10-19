import test from 'ava';
import axios from 'axios';
import dayjs from 'dayjs';
import { Session, SessionConfig } from './src';

let config: SessionConfig;
let consumptionSession: Session;
let productionSession: Session;

const daysAgo = (n: number) => dayjs().subtract(n, 'days').format('YYYY-MM-DD');

test.before(async () => {
    console.info('Generating authorization code...');
    const authorizeURL = await axios
        .get('https://linky.bokub.vercel.app/api/auth?state=test3') // This is a test server with fake data
        .then((r) => 'https://linky.bokub.vercel.app/api/callback?' + r.data.match('var url = ".+\\?(.+)')[1]);
    console.info('Generating tokens...');
    const authorizeResult = await axios
        .get(authorizeURL)
        .then((r) => r.data.response)
        .catch((e) => {
            const code = e.response ? e.response.status : 0;
            const body = e.response ? e.response.data : e;
            throw new Error(
                `error getting tokens\nURL = ${authorizeURL}\nCode = ${code}.\nError = ${JSON.stringify(body)}`
            );
        });
    console.info('Tokens successfully retrieved!');

    const usagePointIds = authorizeResult.usage_points_id.split(',');

    config = {
        accessToken: authorizeResult.access_token,
        refreshToken: authorizeResult.refresh_token,
        usagePointId: usagePointIds[0],
        sandbox: true,
    };
    consumptionSession = new Session(config);
    productionSession = new Session({ ...config, usagePointId: usagePointIds[1] });
});

test('propagates errors', async (t) => {
    await t.throwsAsync(() => consumptionSession.getDailyConsumption(daysAgo(200), daysAgo(203)), {
        message: 'Invalid request: Start date should be before end date.',
    });
});

test('can retrieve daily consumption', async (t) => {
    const data = await consumptionSession.getDailyConsumption(daysAgo(203), daysAgo(200));
    t.is(data.unit, 'Wh');
    t.is(data.data.length, 3);
    t.deepEqual(
        data.data.map((d) => d.date),
        [daysAgo(203), daysAgo(202), daysAgo(201)]
    );
});

test('can retrieve load curve', async (t) => {
    const data = await consumptionSession.getLoadCurve(daysAgo(200), daysAgo(199));
    t.is(data.unit, 'W');
    t.is(data.data.length, 48);
    t.is(data.data[0].date, `${daysAgo(200)} 00:00:00`);
    t.is(data.data[3].date, `${daysAgo(200)} 01:30:00`);
});

test('can retrieve max power', async (t) => {
    const data = await consumptionSession.getMaxPower(daysAgo(203), daysAgo(200));
    t.is(data.unit, 'VA');
    t.is(data.data.length, 3);
    t.deepEqual(
        data.data.map((d) => d.date.slice(0, 10)),
        [daysAgo(203), daysAgo(202), daysAgo(201)]
    );
});

test('can retrieve daily production', async (t) => {
    const data = await productionSession.getDailyProduction(daysAgo(203), daysAgo(200));
    t.is(data.unit, 'Wh');
    t.is(data.data.length, 3);
    t.deepEqual(
        data.data.map((d) => d.date),
        [daysAgo(203), daysAgo(202), daysAgo(201)]
    );
});

test('can retrieve production load curve', async (t) => {
    const data = await productionSession.getProductionLoadCurve(daysAgo(202), daysAgo(201));
    t.is(data.unit, 'W');
    t.is(data.data.length, 48);
    t.is(data.data[0].date, `${daysAgo(202)} 00:00:00`);
    t.is(data.data[3].date, `${daysAgo(202)} 01:30:00`);
});

test.after('token is renewed automatically', async (t) => {
    t.plan(4);

    config.accessToken = 'expired';
    config.onTokenRefresh = (a, r) => {
        t.truthy(r); // This MUST be called for the test to succeed
        console.log('Tokens renewed');
    };

    const expiredSession = new Session(config);
    const data = await expiredSession.getDailyConsumption(daysAgo(201), daysAgo(200));
    t.is(data.data.length, 1);

    config.refreshToken = 'invalid';
    config.accessToken = 'expired';
    config.onTokenRefresh = (a, r) => {
        t.falsy(r); // This MUST be called for the test to succeed
        console.log('Tokens expired');
    };

    const invalidSession = new Session(config);
    await t.throwsAsync(invalidSession.getDailyConsumption(daysAgo(201), daysAgo(200)));
});
