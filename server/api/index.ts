import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import qs from 'qs';

const { BASE_URI, REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } = process.env;

export default (req: NowRequest, res: NowResponse) => {
    const { state, code } = req.query;
    if (state && code) {
        return handleAuthorizeRedirect(state.toString(), code.toString(), res);
    }
    return handleAuthorize(res);
};

function handleAuthorize(res: NowResponse) {
    const state = 'fz80ac784';
    return res.redirect(
        `${BASE_URI}/dataconnect/v1/oauth2/authorize` +
            `?client_id=${CLIENT_ID}&state=${state}&duration=P4M&response_type=code`
    );
}

function handleAuthorizeRedirect(state: string, code: string, res: NowResponse) {
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
        .then((r) => res.json({ response: r.data }))
        .catch((e) => res.send(e.response ? e.response.data : e).status(500));
}
