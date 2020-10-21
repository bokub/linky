import { NowRequest, NowResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import * as qs from 'qs';

const { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SANDBOX } = process.env;

export default (req: NowRequest, res: NowResponse) => {
    const { state, code, error } = req.query;
    const intCode = parseInt(code ? code.toString() : '', 10);
    if (error && intCode) {
        return res.status(intCode).send(error + '\n' + (req.query.error_description || ''));
    }
    if (!state || !code) {
        return res.status(400).send('state and code are mandatory');
    }

    const baseURI = SANDBOX ? 'https://gw.hml.api.enedis.fr' : 'https://gw.prd.api.enedis.fr';
    return axios({
        method: 'post',
        url: `${baseURI}/v1/oauth2/token`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
        }),
    })
        .then((r) => {
            if (state.indexOf('test') === 0) {
                return res.json({ response: r.data });
            }
            const html = readFileSync(join(__dirname, '..', 'tokens.html'), 'utf8')
                .replace(/%access_token%/g, r.data.access_token)
                .replace(/%refresh_token%/g, r.data.refresh_token)
                .replace(/%usage_point_id%/g, r.data.usage_points_id.split(',')[0])
                .replace(/%usage_points_id%/g, r.data.usage_points_id.replace(/,/g, '\n'));
            res.send(html);
        })
        .catch((e) => {
            const code = e.response ? e.response.status : 0;
            const body = e.response ? e.response.data : e;
            console.error(`error getting token.\nCode = ${code}.\nError = ${body}`);
            res.status(code || 500).send(body || e);
        });
};
