import { NowRequest, NowResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import * as qs from 'qs';

const { BASE_URI, REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } = process.env;

export default (req: NowRequest, res: NowResponse) => {
    const { state, code } = req.query;
    if (!state || !code) {
        return res.status(400).send('state and code are mandatory');
    }

    return axios({
        method: 'post',
        url: `${BASE_URI}/v1/oauth2/token`,
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
            const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf8')
                .replace(/<!-- index -->.+<!-- index -->/gs, '')
                .replace('<form style="display: none">', '<form>')
                .replace(/%access_token%/g, r.data.access_token)
                .replace(/%refresh_token%/g, r.data.refresh_token)
                .replace(/%usage_point_id%/g, r.data.usage_points_id.split(',')[0])
                .replace(/%usage_points_id%/g, r.data.usage_points_id.replace(/,/g, '\n'));
            res.send(html);
        })
        .catch((e) => res.status(500).send(e.response ? e.response.data : e));
};
