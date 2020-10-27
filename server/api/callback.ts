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
        return res.status(400).send('Les paramètres state et code sont obligatoires');
    }

    let timeout = false;
    const handle = setTimeout(() => {
        timeout = true;
        return res
            .status(504)
            .send("Le serveur d'Enedis a mis trop longtemps à répondre. Rafraichissez la page (F5) pour réessayer, ou revenez plus tard.");
    }, 10000 - 20);

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
                return timeout || res.json({ response: r.data });
            }
            const html = readFileSync(join(__dirname, '..', 'tokens.html'), 'utf8')
                .replace(/%access_token%/g, r.data.access_token)
                .replace(/%refresh_token%/g, r.data.refresh_token)
                .replace(/%usage_point_id%/g, r.data.usage_points_id.split(',')[0])
                .replace(/%usage_points_id%/g, r.data.usage_points_id.replace(/,/g, '\n'));
            return timeout || res.send(html);
        })
        .catch((e) => {
            const code = e.response ? e.response.status : 0;
            const body = e.response ? e.response.data : e.message;
            console.error(`Erreur: impossible d'obtenir le token.\nCode = ${code}.\nError = ${body}`);
            return timeout || res.status(code || 500).send(body);
        })
        .finally(() => {
            clearTimeout(handle);
        });
};
