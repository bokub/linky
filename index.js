const axios = require('axios');
const dayjs = require('dayjs');

const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

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
			throw new Error('Unexpected login response (2): ' + err.message);
		}

		const cookies = err.response.headers['set-cookie']
			.filter(el => el.indexOf('Domain=.enedis.fr') > -1)
			.filter(el => el.indexOf('Expires=Thu, 01-Jan-1970 00:00:10 GMT') === -1);

		if (!cookies || cookies.length === 0) {
			throw new Error('Unexpected login response (3)');
		}
		const authCookies = cookies.filter(h => h.indexOf('iPlanetDirectoryPro=') === 0);
		if (authCookies.length === 0) {
			throw new Error('The email or the password is incorrect');
		}
		return new LinkySession(cookies);
	}

	throw new Error('Unexpected login response (1)');
}

class LinkySession {
	constructor(cookies) {
		this.cookies = cookies;
	}

	async getHourlyData() {
		const data = await this._getData('urlCdcHeure', dayjs().add(-1, 'day'), dayjs());
		return LinkySession.parseData(data, 0.5, 'hour', '{YYYY} MM-DDTHH:mm:ss SSS [Z] A');
	}

	async getDailyData() {
		const data = await this._getData('urlCdcJour', dayjs().add(-1, 'day').add(-1, 'month'), dayjs().add(-1, 'day'));
		return LinkySession.parseData(data, 1, 'days', '{YYYY} MM-DDTHH:mm:ss SSS [Z] A');
	}

	async getMonthlyData() {
		const data = await this._getData('urlCdcMois', dayjs().add(-11, 'month'), dayjs());
		return LinkySession.parseData(data, 1, 'month', '{YYYY} MM-DDTHH:mm:ss SSS [Z] A');
	}

	async getYearlyData() {
		const data = await this._getData('urlCdcAn', null, null);
		return LinkySession.parseData(data, 1, 'year', '{YYYY} MM-DDTHH:mm:ss SSS [Z] A');
	}

	async _getData(resource, start, end) {
		const reqPart = 'lincspartdisplaycdc_WAR_lincspartcdcportlet';

		const body = new URLSearchParams();
		body.append('_' + reqPart + '_dateDebut', start ? start.format('DD/MM/YYYY') : null);
		body.append('_' + reqPart + '_dateFin', end ? end.format('DD/MM/YYYY') : null);

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
			if (!err.response || err.response.status !== 302) {
				throw new Error('Unexpected export response (2): ' + err.message);
			}
			const newCookies = err.response.headers['set-cookie'];
			this.cookies = this.cookies.concat(newCookies);

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
				throw new Error('Unexpected export response (3): ' + err.message);
			}
		}

		if (resp.data.indexOf('Conditions d\'utilisation') > -1) {
			throw new Error('Please log in manually and accept the new terms of service');
		}

		throw new Error('Unexpected export response (1): ' + resp.data);
	}

	getCookie() {
		return this.cookies.map(c => c.substr(0, c.indexOf(';'))).reduce((a, b) => a + '; ' + b);
	}

	static parseData(input, step, unit, format) {
		console.log(input);
		const start = dayjs(get(['graphe', 'periode', 'dateDebut'], input));
		const offset = get(['graphe', 'decalage'], input) || 0;
		console.log('start', start.format(format));
		console.log('offset', offset);
		const values = get(['graphe', 'data'], input);
		if (!Array.isArray(values)) {
			throw new TypeError(`Unexpected data: ${input}`);
		}
		// TODO
		return values;
	}
}

module.exports = {
	login
};
