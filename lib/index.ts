import axios, { AxiosError } from 'axios';
import jwt from 'jsonwebtoken';

const API_HOST = 'https://conso.boris.sh';

export enum DataType {
  daily_consumption = 'consommation_quotidienne',
  consumption_load_curve = 'courbe_de_charge_consommation',
  consumption_max_power = 'puissance_conso_max_quotidienne',
  daily_production = 'production_quotidienne',
  production_load_curve = 'courbe_de_charge_production',
}

export type APIResponse = {
  idPrm: string;
  etapeMetier: string;
  periode: {
    dateDebut: string;
    dateFin: string;
  };
  typeValeur: string;
  modeCalcul: string;
  pas: string;
  grandeur: Array<{
    grandeurMetier: string;
    grandeurPhysique: string;
    unite: string;
    points: Array<{ v: string | null; d: string }>;
    calendrier: unknown[];
  }>;
  contexte: unknown[];
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

export class Session {
  private prms: string[] = [];
  public userAgent = '@bokub/linky';

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

  getDailyConsumption(start: string, end: string): Promise<APIResponse> {
    return this.callApi(DataType.daily_consumption, start, end);
  }

  getLoadCurve(start: string, end: string): Promise<APIResponse> {
    return this.callApi(DataType.consumption_load_curve, start, end);
  }

  getMaxPower(start: string, end: string, pas?: string, grandeurPhysique?: string): Promise<APIResponse> {
    return this.callApi(DataType.consumption_max_power, start, end, { mesuresPas: pas, grandeurPhysique });
  }

  getDailyProduction(start: string, end: string): Promise<APIResponse> {
    return this.callApi(DataType.daily_production, start, end);
  }

  getProductionLoadCurve(start: string, end: string): Promise<APIResponse> {
    return this.callApi(DataType.production_load_curve, start, end);
  }

  private callApi<T>(
    type: DataType,
    start: string,
    end: string,
    optionalParams: { mesuresPas?: string; grandeurPhysique?: string } = {}
  ): Promise<T> {
    const params = new URLSearchParams({
      dateDebut: start,
      dateFin: end,
      pointId: this.prm || this.prms[0],
    });
    if (optionalParams.mesuresPas) {
      params.set('mesuresPas', optionalParams.mesuresPas);
    }
    if (optionalParams.grandeurPhysique) {
      params.set('grandeurPhysique', optionalParams.grandeurPhysique);
    }
    const url = `${API_HOST}/api/${type}?${params}`;

    return axios
      .get<T>(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'User-Agent': this.userAgent,
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
