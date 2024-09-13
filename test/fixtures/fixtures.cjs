const nock = require('nock');

/* THIS FILE HAS BEEN GENERATED WITH npm run generate-fixtures */

if (!process.env.RECORDING) {
  nock('https://conso.boris.sh')
    .get(/99999999999999/)
    .reply(401, { status: 401, message: "Votre token est invalide ou ne permet pas d'accéder à ce PRM" })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/daily_consumption\?start=2023-04-02&end=2023-04-01/)
    .reply(400, {
      status: 400,
      message: 'The Enedis API returned an error',
      error: { error: 'Invalid_request', error_description: 'Start date should be before end date.' },
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/daily_consumption\?start=2023-04-01&end=2023-04-04/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-04',
      quality: 'BRUT',
      reading_type: { unit: 'Wh', measurement_kind: 'energy', aggregate: 'sum', measuring_period: 'P1D' },
      interval_reading: [
        { value: '11776', date: '2023-04-01' },
        { value: '14401', date: '2023-04-02' },
        { value: '12820', date: '2023-04-03' },
      ],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/daily_consumption\?start=2023-04-01&end=2023-04-02/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-02',
      quality: 'BRUT',
      reading_type: { unit: 'Wh', measurement_kind: 'energy', aggregate: 'sum', measuring_period: 'P1D' },
      interval_reading: [{ value: '11776', date: '2023-04-01' }],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/consumption_load_curve\?start=2023-04-01&end=2023-04-02/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-02',
      quality: 'BRUT',
      reading_type: { unit: 'W', measurement_kind: 'power', aggregate: 'average' },
      interval_reading: [
        { value: '752', date: '2023-04-01 00:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '346', date: '2023-04-01 01:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '250', date: '2023-04-01 01:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '154', date: '2023-04-01 02:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '126', date: '2023-04-01 02:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '110', date: '2023-04-01 03:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '140', date: '2023-04-01 03:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '236', date: '2023-04-01 04:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '138', date: '2023-04-01 04:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '104', date: '2023-04-01 05:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '128', date: '2023-04-01 05:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '234', date: '2023-04-01 06:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '124', date: '2023-04-01 06:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '104', date: '2023-04-01 07:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '360', date: '2023-04-01 07:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '124', date: '2023-04-01 08:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '122', date: '2023-04-01 08:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '108', date: '2023-04-01 09:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '120', date: '2023-04-01 09:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '106', date: '2023-04-01 10:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '250', date: '2023-04-01 10:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '108', date: '2023-04-01 11:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '230', date: '2023-04-01 11:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '1594', date: '2023-04-01 12:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '3150', date: '2023-04-01 12:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '750', date: '2023-04-01 13:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '1178', date: '2023-04-01 13:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '566', date: '2023-04-01 14:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '206', date: '2023-04-01 14:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '440', date: '2023-04-01 15:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '1510', date: '2023-04-01 15:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '1004', date: '2023-04-01 16:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '666', date: '2023-04-01 16:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '446', date: '2023-04-01 17:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '276', date: '2023-04-01 17:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '510', date: '2023-04-01 18:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '588', date: '2023-04-01 18:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '404', date: '2023-04-01 19:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '286', date: '2023-04-01 19:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '2256', date: '2023-04-01 20:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '1620', date: '2023-04-01 20:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '684', date: '2023-04-01 21:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '312', date: '2023-04-01 21:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '166', date: '2023-04-01 22:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '148', date: '2023-04-01 22:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '86', date: '2023-04-01 23:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '144', date: '2023-04-01 23:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '88', date: '2023-04-02 00:00:00', interval_length: 'PT30M', measure_type: 'B' },
      ],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/consumption_max_power\?start=2023-04-01&end=2023-04-04/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-04',
      quality: 'BRUT',
      reading_type: { unit: 'VA', measurement_kind: 'power', aggregate: 'maximum', measuring_period: 'P1D' },
      interval_reading: [
        { value: '4638', date: '2023-04-01 12:06:20' },
        { value: '4410', date: '2023-04-02 19:27:46' },
        { value: '3570', date: '2023-04-03 21:42:12' },
      ],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/consumption_max_power\?start=2023-04-01&end=2023-04-02/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-02',
      quality: 'BRUT',
      reading_type: { unit: 'VA', measurement_kind: 'power', aggregate: 'maximum', measuring_period: 'P1D' },
      interval_reading: [{ value: '4638', date: '2023-04-01 12:06:20' }],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/daily_production\?start=2023-04-01&end=2023-04-04/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-04',
      quality: 'BRUT',
      reading_type: { unit: 'Wh', measurement_kind: 'energy', aggregate: 'sum', measuring_period: 'P1D' },
      interval_reading: [
        { value: '643', date: '2023-04-01' },
        { value: '6', date: '2023-04-02' },
        { value: '15411', date: '2023-04-03' },
      ],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/daily_production\?start=2023-04-01&end=2023-04-02/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-02',
      quality: 'BRUT',
      reading_type: { unit: 'Wh', measurement_kind: 'energy', aggregate: 'sum', measuring_period: 'P1D' },
      interval_reading: [{ value: '643', date: '2023-04-01' }],
    })
    .persist();

  nock('https://conso.boris.sh')
    .get(/api\/production_load_curve\?start=2023-04-01&end=2023-04-02/)
    .reply(200, {
      usage_point_id: '11111111111111',
      start: '2023-04-01',
      end: '2023-04-02',
      quality: 'BRUT',
      reading_type: { unit: 'W', measurement_kind: 'power', aggregate: 'average' },
      interval_reading: [
        { value: '0', date: '2023-04-01 00:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 01:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 01:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 02:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 02:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 03:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 03:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 04:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 04:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 05:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 05:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 06:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 06:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 07:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 07:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 08:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 08:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 09:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 09:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 10:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 10:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '132', date: '2023-04-01 11:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '112', date: '2023-04-01 11:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '368', date: '2023-04-01 12:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '288', date: '2023-04-01 12:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '16', date: '2023-04-01 13:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '122', date: '2023-04-01 13:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '102', date: '2023-04-01 14:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '26', date: '2023-04-01 14:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '24', date: '2023-04-01 15:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 15:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 16:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '76', date: '2023-04-01 16:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '16', date: '2023-04-01 17:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 17:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 18:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '4', date: '2023-04-01 18:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 19:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 19:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 20:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 20:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 21:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 21:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 22:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 22:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 23:00:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-01 23:30:00', interval_length: 'PT30M', measure_type: 'B' },
        { value: '0', date: '2023-04-02 00:00:00', interval_length: 'PT30M', measure_type: 'B' },
      ],
    })
    .persist();
}
