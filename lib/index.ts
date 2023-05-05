import axios, { AxiosError } from 'axios';
import qs from 'qs';
import jwt from 'jsonwebtoken';

const API_HOST = 'https://conso.boris.sh';

export enum DataType {
  daily_consumption = 'daily_consumption',
  consumption_load_curve = 'consumption_load_curve',
  consumption_max_power = 'consumption_max_power',
  daily_production = 'daily_production',
  production_load_curve = 'production_load_curve',
}

export type APIResponse = {
  usage_point_id: string;
  start: string;
  end: string;
  quality: string;
  interval_reading: Array<{ value: string; date: string }>;
  reading_type: {
    unit: string;
    measurement_kind: string;
    aggregate: string;
    measuring_period?: string;
  };
};

export class APIError extends Error {
  constructor(public err: AxiosError, public code: string, public response: any) {
    super('Conso API a répondu avec une erreur');
  }

  toString() {
    return (
      `Conso API a répondu avec une erreur\nCode: ${this.code}\nRéponse : ` + JSON.stringify(this.response, null, 4)
    );
  }
}

export type EnergyResponse = APIResponse & {
  reading_type: {
    unit: 'Wh';
    measurement_kind: 'energy';
    aggregate: 'sum';
    measuring_period: 'P1D';
  };
};

export type AveragePowerResponse = APIResponse & {
  reading_type: {
    unit: 'W';
    measurement_kind: 'power';
    aggregate: 'average';
  };
};

export type MaxPowerResponse = APIResponse & {
  reading_type: {
    unit: 'VA';
    measurement_kind: 'power';
    aggregate: 'maximum';
    measuring_period: 'P1D';
  };
};

export class Session {
  private prms: string[] = [];

  constructor(private token: string, private prm?: string) {
    try {
      const decoded: { sub: string[] } = jwt.decode(token) as any;
      this.prms = decoded.sub;
    } catch (err) {
      throw new Error('Le token est invalide');
    }

    if (!Array.isArray(this.prms) || this.prms.length === 0) {
      throw new Error('Le token est invalide');
    }

    if (this.prm && !this.prms.includes(this.prm)) {
      throw new Error("Ce token ne permet pas d'accéder au PRM " + this.prm);
    }
  }

  getDailyConsumption(start: string, end: string): Promise<EnergyResponse> {
    return this.callApi<EnergyResponse>(DataType.daily_consumption, start, end);
  }

  getLoadCurve(start: string, end: string): Promise<AveragePowerResponse> {
    return this.callApi<AveragePowerResponse>(DataType.consumption_load_curve, start, end);
  }

  getMaxPower(start: string, end: string): Promise<MaxPowerResponse> {
    return this.callApi<MaxPowerResponse>(DataType.consumption_max_power, start, end);
  }

  getDailyProduction(start: string, end: string): Promise<EnergyResponse> {
    return this.callApi<EnergyResponse>(DataType.daily_production, start, end);
  }

  getProductionLoadCurve(start: string, end: string): Promise<AveragePowerResponse> {
    return this.callApi<AveragePowerResponse>(DataType.production_load_curve, start, end);
  }

  private callApi<T>(type: DataType, start: string, end: string): Promise<T> {
    const url = `${API_HOST}/api/${type}?${qs.stringify({
      start: start,
      end: end,
      prm: this.prm || this.prms[0],
    })}`;

    return axios
      .get<T>(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'User-Agent': '@bokub/linky',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        if (err.response) {
          throw new APIError(err, err.response.status, err.response.data);
        }
        if (err.request) {
          throw new Error(`Aucune réponse de Conso API\nRequête : ` + JSON.stringify(err.request, null, 4));
        }
        throw new Error(`Impossible d'appeler Conso API\nErreur : ${err.message}`);
      });
  }
}
