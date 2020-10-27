import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import qs from 'qs';

const { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SANDBOX } = process.env;

export default (req: NowRequest, res: NowResponse) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Le paramètre token est obligatoire');
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
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: token,
        }),
    })
        .then((r) => res.json({ response: r.data }))
        .catch((e) => {
            const code = e.response ? e.response.status : 0;
            const body = e.response ? e.response.data : e.message;
            console.error(`Erreur: impossible d'obtenir le token.\nCode = ${code}.\nError = ${body}`);
            res.status(code || 500).send(body);
        });
};
