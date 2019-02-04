import test from 'ava';
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

test('Data can be retrieved', async t => {
	const data = await session.getDailyData();
	t.true(data.length > 25);
});
