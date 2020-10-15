import test from 'ava';
import axios from 'axios';
import { Session, SessionConfig } from './src';

let session: Session;

test.before(async () => {
    console.info('Generating authorization code...');
    const authorizeURL = await axios
        .get('https://linky.bokub.vercel.app/api/auth?state=test1') // This is a test server with fake data
        .then((r) => r.data.match('var url = "(.+)"')[1].replace('conso', 'linky.bokub'));
    console.info('Generating tokens...');
    const authorizeResult = await axios.get(authorizeURL).then((r) => r.data.response);
    console.info('Tokens successfully retrieved!');

    const config: SessionConfig = {
        accessToken: authorizeResult.access_token,
        refreshToken: authorizeResult.refresh_token,
        usagePointId: authorizeResult.usage_points_id,
        sandbox: true,
        onTokenRefresh: (accessToken, refreshToken) => {
            console.log(accessToken, refreshToken);
        },
    };
    session = new Session(config);
});

test('propagates errors', async (t) => {
    await t.throwsAsync(() => session.getDailyConsumption('2020-08-24', '2020-08-22'), {
        message: 'Invalid request: Start date should be before end date.',
    });
});

test('can retrieve daily consumption', async (t) => {
    const data = await session.getDailyConsumption('2020-08-24', '2020-08-27');
    t.is(data.unit, 'Wh');
    t.is(data.data.length, 3);
    t.deepEqual(
        data.data.map((d) => d.date),
        ['2020-08-24', '2020-08-25', '2020-08-26']
    );
});

test('can retrieve load curve', async (t) => {
    const data = await session.getLoadCurve('2020-08-24', '2020-08-25');
    t.is(data.unit, 'W');
    t.is(data.data.length, 48);
    t.is(data.data[0].date, '2020-08-24 00:00:00');
    t.is(data.data[3].date, '2020-08-24 01:30:00');
});

test('can retrieve max power', async (t) => {
    const data = await session.getMaxPower('2020-08-24', '2020-08-27');
    t.is(data.unit, 'VA');
    t.is(data.data.length, 3);
    t.deepEqual(
        data.data.map((d) => d.date.slice(0, 10)),
        ['2020-08-24', '2020-08-25', '2020-08-26']
    );
});
