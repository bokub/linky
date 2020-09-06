import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import qs from 'qs';

const { BASE_URI, REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } = process.env;

export default (req: NowRequest, res: NowResponse) => {
    const { token } = req.query;

    if (!token) {
        return res.send('Missing token parameter').status(400);
    }

    return axios({
        method: 'post',
        url: `${BASE_URI}/v1/oauth2/token`,
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
        .catch((e) => res.send(e.response ? e.response.data : e).status(500));
};
