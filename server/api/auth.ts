import { NowRequest, NowResponse } from '@vercel/node';

const { BASE_URI, CLIENT_ID } = process.env;

export default (req: NowRequest, res: NowResponse) => {
    const state = req.query.state || Array.from({ length: 8 }, () => Math.random().toString(36)[2]).join('');
    return res.redirect(
        `${BASE_URI}/dataconnect/v1/oauth2/authorize` +
            `?client_id=${CLIENT_ID}&state=${state}&duration=P3Y&response_type=code`
    );
};
