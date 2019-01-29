const axios = require('axios');
const dayjs = require('dayjs');

const enedisNotice = ' - Check the Enedis website if the error persists';
const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);
const parseDate = dt => dayjs(`${dt.substr(6, 4)}-${dt.substr(3, 2)}-${dt.substr(0, 2)}`);

async function login(email, password) {
	const body = new URLSearchParams({
		IDToken1: email,
		IDToken2: password,
		SunQueryParamsString: 'cmVhbG09cGFydGljdWxpZXJz', // Base64 of 'realm=particuliers'
		encoded: true,
		gx_charset: 'UTF-8'
	});
	const uri = 'https://espace-client-connexion.enedis.fr/auth/UI/Login';

	try {
		await axios.post(uri, body, {
			maxRedirects: 0
		});
	} catch (err) {
		if (!err.response || err.response.status !== 302) {
			throw new Error('Unexpected login response (2): ' + err.message + enedisNotice);
		}

		const cookies = err.response.headers['set-cookie']
			.filter(el => el.indexOf('Domain=.enedis.fr') > -1)
			.filter(el => el.indexOf('Expires=Thu, 01-Jan-1970 00:00:10 GMT') === -1);

		if (!cookies || cookies.length === 0) {
			throw new Error('Unexpected login response (3)' + enedisNotice);
		}
		const authCookies = cookies.filter(h => h.indexOf('iPlanetDirectoryPro=') === 0);
		if (authCookies.length === 0) {
			throw new Error('The email or the password is incorrect');
		}
		return new LinkySession(cookies);
	}

	throw new Error('Unexpected login response (1)' + enedisNotice);
}

class LinkySession {
	constructor(cookies) {
		this.cookies = cookies;
		this.calledOnce = false;
	}

	async getHourlyData(opts) {
		opts = LinkySession.parseOpts(opts, dayjs().add(-1, 'day'), dayjs());
		const data = await this.getData('urlCdcHeure', opts);
		return LinkySession.parseData(data, 0.5, 'hour');
	}

	async getDailyData(opts) {
		opts = LinkySession.parseOpts(opts, dayjs().add(-1, 'day').add(-1, 'month'), dayjs().add(-1, 'day'));
		const data = await this.getData('urlCdcJour', opts);
		return LinkySession.parseData(data, 1, 'days');
	}

	async getMonthlyData(opts) {
		opts = LinkySession.parseOpts(opts, dayjs().add(-11, 'month'), dayjs());
		const data = await this.getData('urlCdcMois', opts);
		return LinkySession.parseData(data, 1, 'month');
	}

	async getYearlyData(_) {
		const data = await this.getData('urlCdcAn', {});
		return LinkySession.parseData(data, 1, 'year');
	}

	async getData(resource, opts) {
		const reqPart = 'lincspartdisplaycdc_WAR_lincspartcdcportlet';

		const body = new URLSearchParams();
		body.append('_' + reqPart + '_dateDebut', opts.start ? opts.start.format('DD/MM/YYYY') : null);
		body.append('_' + reqPart + '_dateFin', opts.end ? opts.end.format('DD/MM/YYYY') : null);

		const query = new URLSearchParams({
			p_p_id: reqPart,
			p_p_lifecycle: 2,
			p_p_state: 'normal',
			p_p_mode: 'view',
			p_p_resource_id: resource,
			p_p_cacheability: 'cacheLevelPage',
			p_p_col_id: 'column-1',
			p_p_col_pos: 1,
			p_p_col_count: 3
		}).toString();

		const url = 'https://espace-client-particuliers.enedis.fr/group/espace-particuliers/suivi-de-consommation?' + query;

		let resp;
		try {
			// Call once
			resp = await axios.post(url, body, {
				maxRedirects: 0,
				headers: {Cookie: this.getCookie()},
				withCredentials: true
			});
		} catch (err) {
			if (!err.response || err.response.status !== 302 || this.calledOnce) {
				throw new Error('Unexpected export response (2): ' + err.message + enedisNotice);
			}
			const newCookies = err.response.headers['set-cookie'];
			this.cookies = this.cookies.concat(newCookies);
			this.calledOnce = true;

			try {
				// Call a second time with the new cookies
				resp = await axios.post(url, body, {
					maxRedirects: 0,
					withCredentials: true,
					headers: {
						Cookie: this.getCookie()
					}
				});
				return resp.data;
			} catch (err) {
				throw new Error('Unexpected export response (3): ' + err.message + enedisNotice);
			}
		}

		if (this.calledOnce) {
			return resp.data;
		}

		if (JSON.stringify(resp.data).indexOf('Conditions') > -1) {
			throw new Error('Please log in manually and accept the new terms of service');
		}

		throw new Error('Unexpected export response (1): ' + resp.data + enedisNotice);
	}

	getCookie() {
		return this.cookies.map(c => c.substr(0, c.indexOf(';'))).reduce((a, b) => a + '; ' + b);
	}

	static parseOpts(opts, start, end) {
		opts = opts || {};
		return {
			start: opts.start ? parseDate(opts.start) : start,
			end: opts.end ? parseDate(opts.end) : end
		};
	}

	static parseData(input, step, unit) {
		if (get(['etat', 'valeur'], input) === 'nonActive') {
			throw new Error('No available data for the selected period');
		}

		const values = get(['graphe', 'data'], input);
		if (!Array.isArray(values)) {
			throw new Error(`Unexpected data: ${JSON.stringify(input)}` + enedisNotice);
		}

		const start = parseDate(get(['graphe', 'periode', 'dateDebut'], input));
		const offset = get(['graphe', 'decalage'], input) || 0;

		values.splice(0, offset);
		values.splice(-offset, offset);

		const res = [];
		let date = start;
		for (const val of values) {
			res.push({
				date: date.format('YYYY-MM-DD HH:mm:ss'),
				value: val.valeur < 0 ? null : val.valeur
			});
			date = date.add(step, unit);
		}

		return res;
	}
}

module.exports = {
	login
};
