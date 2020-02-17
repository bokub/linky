import test from 'ava';
import dayjs from 'dayjs';
import linky from '.';

const user = process.env.ENEDIS_USER || '';
const pswd = process.env.ENEDIS_PASSWORD || '';
let session = null;

test('ENV variables are defined', t => {
	t.not(user, '', 'ENEDIS_USER is undefined in ENV');
	t.not(pswd, '', 'ENEDIS_PASSWORD is undefined in ENV');
});

test('Wrong credentials throw an error', async t => {
	await t.throwsAsync(linky.login(user, pswd + '$'));
});

test('Login works', async t => {
	session = await linky.login(user, pswd);
	t.truthy(session);
	t.truthy(session.cookies);
	t.false(session.calledOnce);
});

test('Daily data can be retrieved', async t => {
	const data = await session.getDailyData();
	t.true(data.length > 25);
});

test('Monthly data can be retrieved', async t => {
	const data = await session.getMonthlyData();
	t.true(data.length > 10);
});

test('Yearly data can be retrieved', async t => {
	const data = await session.getYearlyData();
	t.true(data.length > 1);
});

test('Hourly data can be retrieved', async t => {
	const data = await session.getHourlyData({
		start: dayjs().add(-3, 'day').format('DD/MM/YYYY'),
		end: dayjs().add(-2, 'day').format('DD/MM/YYYY')
	});
	t.true(data.length > 45);
});

test('Long periods cannot be retrieved', async t => {
	await t.throwsAsync(session.getDailyData({
		start: dayjs().add(-35, 'day').format('DD/MM/YYYY'),
		end: dayjs().format('DD/MM/YYYY')
	}));
});
