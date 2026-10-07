const nock = require('nock');

/* THIS FILE HAS BEEN GENERATED WITH npm run generate-fixtures */

if (!process.env.RECORDING) {
  nock('https://conso.boris.sh')
    .get(/99999999999999/)
    .reply(401, { status: 401, message: "Votre token est invalide ou ne permet pas d'accéder à ce PRM" })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/consommation_quotidienne\?.*dateDebut=2026-04-02.*dateFin=2026-04-01/)
    .reply(400, {
      status: 400,
      message: 'The Enedis API returned an error',
      error: { error: 'ADAM-ERR0002', error_description: 'La date de fin doit être supérieure à la date de début.' },
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/consommation_quotidienne\?.*dateDebut=2026-04-01.*dateFin=2026-04-04/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-04' },
      typeValeur: 'GLOBALE',
      modeCalcul: 'DIFF.INDEX',
      pas: 'P1D',
      grandeur: [
        {
          grandeurMetier: 'CONS',
          grandeurPhysique: 'EA',
          unite: 'Wh',
          points: [
            { v: '9271', d: '2026-04-01' },
            { v: '12724', d: '2026-04-02' },
            { v: '14054', d: '2026-04-03' },
          ],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/consommation_quotidienne\?.*dateDebut=2026-04-01.*dateFin=2026-04-02/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-02' },
      typeValeur: 'GLOBALE',
      modeCalcul: 'DIFF.INDEX',
      pas: 'P1D',
      grandeur: [
        {
          grandeurMetier: 'CONS',
          grandeurPhysique: 'EA',
          unite: 'Wh',
          points: [{ v: '9271', d: '2026-04-01' }],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/courbe_de_charge_consommation\?.*dateDebut=2026-04-01.*dateFin=2026-04-02/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-02' },
      modeCalcul: 'MESURE',
      grandeur: [
        {
          grandeurMetier: 'CONS',
          grandeurPhysique: 'PA',
          unite: 'W',
          points: [
            { v: '110', d: '2026-04-01 00:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '408', d: '2026-04-01 01:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '112', d: '2026-04-01 01:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '372', d: '2026-04-01 02:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '138', d: '2026-04-01 02:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '190', d: '2026-04-01 03:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '270', d: '2026-04-01 03:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '140', d: '2026-04-01 04:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '2720', d: '2026-04-01 04:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '2092', d: '2026-04-01 05:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '1396', d: '2026-04-01 05:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '1216', d: '2026-04-01 06:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '768', d: '2026-04-01 06:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '516', d: '2026-04-01 07:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '246', d: '2026-04-01 07:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '352', d: '2026-04-01 08:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '204', d: '2026-04-01 08:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '712', d: '2026-04-01 09:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '1062', d: '2026-04-01 09:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '294', d: '2026-04-01 10:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '236', d: '2026-04-01 10:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '170', d: '2026-04-01 11:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '208', d: '2026-04-01 11:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '196', d: '2026-04-01 12:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '178', d: '2026-04-01 12:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '822', d: '2026-04-01 13:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '264', d: '2026-04-01 13:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '146', d: '2026-04-01 14:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '248', d: '2026-04-01 14:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '190', d: '2026-04-01 15:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '190', d: '2026-04-01 15:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '226', d: '2026-04-01 16:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '160', d: '2026-04-01 16:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '210', d: '2026-04-01 17:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '182', d: '2026-04-01 17:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '154', d: '2026-04-01 18:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '182', d: '2026-04-01 18:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '92', d: '2026-04-01 19:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '238', d: '2026-04-01 19:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '86', d: '2026-04-01 20:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '100', d: '2026-04-01 20:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '126', d: '2026-04-01 21:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '82', d: '2026-04-01 21:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '128', d: '2026-04-01 22:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '98', d: '2026-04-01 22:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '84', d: '2026-04-01 23:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '128', d: '2026-04-01 23:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '100', d: '2026-04-02 00:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
          ],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/puissance_conso_max_quotidienne\?.*dateDebut=2026-04-01.*dateFin=2026-04-04/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-04' },
      modeCalcul: 'MESURE',
      pas: 'P1D',
      grandeur: [
        {
          grandeurMetier: 'CONS',
          grandeurPhysique: 'PMA',
          unite: 'VA',
          points: [
            { v: '3533', d: '2026-04-01 04:18:59' },
            { v: '3092', d: '2026-04-02 04:13:22' },
            { v: '3494', d: '2026-04-03 04:12:39' },
          ],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/puissance_conso_max_quotidienne\?.*dateDebut=2026-04-01.*dateFin=2026-04-02/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-02' },
      modeCalcul: 'MESURE',
      pas: 'P1D',
      grandeur: [
        {
          grandeurMetier: 'CONS',
          grandeurPhysique: 'PMA',
          unite: 'VA',
          points: [{ v: '3533', d: '2026-04-01 04:18:59' }],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/production_quotidienne\?.*dateDebut=2026-04-01.*dateFin=2026-04-04/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-04' },
      typeValeur: 'GLOBALE',
      modeCalcul: 'DIFF.INDEX',
      pas: 'P1D',
      grandeur: [
        {
          grandeurMetier: 'PROD',
          grandeurPhysique: 'EA',
          unite: 'Wh',
          points: [
            { v: '1882', d: '2026-04-01' },
            { v: '12072', d: '2026-04-02' },
            { v: '899', d: '2026-04-03' },
          ],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/production_quotidienne\?.*dateDebut=2026-04-01.*dateFin=2026-04-02/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-02' },
      typeValeur: 'GLOBALE',
      modeCalcul: 'DIFF.INDEX',
      pas: 'P1D',
      grandeur: [
        {
          grandeurMetier: 'PROD',
          grandeurPhysique: 'EA',
          unite: 'Wh',
          points: [{ v: '1882', d: '2026-04-01' }],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/courbe_de_charge_production\?.*dateDebut=2026-04-01.*dateFin=2026-04-02/)
    .reply(200, {
      idPrm: '11111111111111',
      etapeMetier: 'BRUT',
      periode: { dateDebut: '2026-04-01', dateFin: '2026-04-02' },
      modeCalcul: 'MESURE',
      grandeur: [
        {
          grandeurMetier: 'PROD',
          grandeurPhysique: 'PA',
          unite: 'W',
          points: [
            { v: '0', d: '2026-04-01 00:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 01:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 01:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 02:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 02:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 03:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 03:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 04:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 04:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 05:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 05:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 06:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 06:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 07:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 07:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 08:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 08:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 09:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '2', d: '2026-04-01 09:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '88', d: '2026-04-01 10:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '30', d: '2026-04-01 10:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '78', d: '2026-04-01 11:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '336', d: '2026-04-01 11:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '28', d: '2026-04-01 12:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '28', d: '2026-04-01 12:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '40', d: '2026-04-01 13:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 13:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '256', d: '2026-04-01 14:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '540', d: '2026-04-01 14:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '390', d: '2026-04-01 15:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '584', d: '2026-04-01 15:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '410', d: '2026-04-01 16:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '270', d: '2026-04-01 16:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '308', d: '2026-04-01 17:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '220', d: '2026-04-01 17:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '112', d: '2026-04-01 18:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '38', d: '2026-04-01 18:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '6', d: '2026-04-01 19:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 19:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 20:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 20:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 21:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 21:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 22:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 22:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 23:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-01 23:30:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
            { v: '0', d: '2026-04-02 00:00:00', p: 'PT30M', n: 'B', iv: '0', ec: '0' },
          ],
          calendrier: [],
        },
      ],
      contexte: [],
    })
    .persist();
}
