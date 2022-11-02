import axios from 'axios';
import qs from 'qs';
import { createHash } from 'crypto';

export type SessionConfig = {
    accessToken: string;
    refreshToken: string;
    usagePointId: string;
    sandbox?: boolean;
    onTokenRefresh?: TokenRefreshCallback;
};

export type Consumption = {
    unit: string;
    data: ConsumptionData[];
};

export type ConsumptionData = {
    date: string;
    value: number;
};

type ReadingTypeLoadCurve = {
    measurement_kind: 'power';
    unit: 'W';
    aggregate: 'average';
};

type ReadingTypeMaxPower = {
    measurement_kind: 'power';
    unit: 'VA';
    aggregate: 'maximum';
};

type ReadingTypeConsumption = {
    measurement_kind: 'energy';
    unit: 'Wh';
    aggregate: 'sum';
};

type ReadingType = ReadingTypeLoadCurve | ReadingTypeMaxPower | ReadingTypeConsumption;
type IntervalReading = {
    value: string;
    date: string;
};

type MeteringResponse = {
    meter_reading: {
        usage_point_id: string;
        start: string;
        end: string;
        quality: string;
        reading_type: ReadingType;
        interval_reading: IntervalReading[];
    };
};

type RefreshTokenResponse = {
    response: {
        access_token?: string;
        refresh_token?: string;
    };
};

export type TokenRefreshCallback = (accessToken: string, refreshToken: string) => void;

export class Session {
    private config: SessionConfig;
    private baseURL: string;
    private uid: string;
    private onTokenRefresh?: TokenRefreshCallback;

    constructor(config: SessionConfig) {
        this.config = config;
        this.baseURL = config.sandbox ? 'https://gw.hml.api.enedis.fr' : 'https://gw.prd.api.enedis.fr';
        this.uid = createHash('sha256').update(config.usagePointId).digest('hex').slice(-7);
        if (config.onTokenRefresh) {
            this.onTokenRefresh = config.onTokenRefresh;
        }
    }

    getDailyConsumption(start: string, end: string) {
        return this.request('daily_consumption', start, end);
    }

    getLoadCurve(start: string, end: string) {
        return this.request('consumption_load_curve', start, end);
    }

    getMaxPower(start: string, end: string) {
        return this.request('daily_consumption_max_power', start, end);
    }

    getDailyProduction(start: string, end: string) {
        return this.request('daily_production', start, end);
    }

    getProductionLoadCurve(start: string, end: string) {
        return this.request('production_load_curve', start, end);
    }

    private request(endpoint: string, start: string, end: string, retrying = false): Promise<Consumption> {
        const url = `${this.baseURL}/v4/metering_data/${endpoint}?${qs.stringify({
            start: start,
            end: end,
            usage_point_id: this.config.usagePointId,
        })}`;

        return axios
            .get<MeteringResponse>(url, {
                headers: {
                    Authorization: `Bearer ${this.config.accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            })
            .then((res) => {
                return {
                    unit: res.data.meter_reading.reading_type.unit,
                    data: res.data.meter_reading.interval_reading.map((d) => ({
                        date: d.date,
                        value: parseFloat(d.value),
                    })),
                };
            })
            .catch((err) => {
                if (err.response) {
                    // Access token is too old, renew it
                    if (err.response.status === 403 && !retrying) {
                        return this.refreshToken().then(() => this.request(endpoint, start, end, true));
                    }
                    if (err.response.status === 400 && err.response.data.error_description) {
                        throw new Error(`Invalid request: ${err.response.data.error_description}`);
                    }
                    throw new Error(
                        `Error from the Enedis API\nCode: ${err.response.status}\nResponse: ` +
                            JSON.stringify(err.response.data, null, 4)
                    );
                }
                if (err.request) {
                    throw new Error(
                        `No response from the Enedis API\nRequest: ` + JSON.stringify(err.request, null, 4)
                    );
                }
                throw new Error(`Cannot call the Enedis API\nError: ${err.message}`);
            });
    }

    private refreshToken() {
        const host = this.config.sandbox ? 'linky.bokub.vercel.app' : 'conso.vercel.app';
        const url = `https://${host}/api/refresh?token=${this.config.refreshToken}&uid=${this.uid}`;
        return axios
            .get<RefreshTokenResponse>(url)
            .then((res) => {
                const { access_token, refresh_token } = res.data.response;
                if (!access_token) {
                    throw new Error(`New access token not found in response:` + JSON.stringify(res.data, null, 4));
                }
                if (!refresh_token) {
                    throw new Error(`New refresh token not found in response:` + JSON.stringify(res.data, null, 4));
                }

                this.config.accessToken = access_token;
                this.config.refreshToken = refresh_token;

                if (this.onTokenRefresh && typeof this.onTokenRefresh === 'function') {
                    this.onTokenRefresh(access_token, refresh_token);
                }
            })
            .catch((err) => {
                if (err.response) {
                    if (
                        err.response.status === 401 &&
                        this.onTokenRefresh &&
                        typeof this.onTokenRefresh === 'function'
                    ) {
                        // Refresh token is not valid anymore: reset credentials
                        this.onTokenRefresh('', '');
                    }
                    throw new Error(
                        `Cannot refresh token\nCode: ${err.response.status}\nResponse: ` +
                            JSON.stringify(err.response.data, null, 4)
                    );
                }
                throw new Error(`Cannot refresh token\nError: ${err.message}`);
            });
    }
}
