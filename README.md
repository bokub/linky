# Linky

[![Version][version-src]][version-href]
[![Build Status][build-src]][build-href]
[![Engines][engine-src]][engine-href]

> Easily retrieve your Linky power consumption

#### If you are looking for a command-line tool, check out  [linky-cli](https://github.com/bokub/linky-cli)

#### > [Lire en français](https://github.com/bokub/linky/blob/master/README.fr.md) <


## Install

```
$ npm i @bokub/linky
```


## Usage

```js
const linky = require('@bokub/linky');

// Log in
const session = await linky.login('my-email@example.com', 'password');

// Retrieve your power consumption
let data = await session.getDailyData();
console.log(data);
// [
//   { date: '2018-09-28 00:00:00', value: 2.944 },
//   { date: '2018-09-29 00:00:00', value: 2.704 },
//   { date: '2018-09-30 00:00:00', value: 3.477 },
//   { date: '2018-10-01 00:00:00', value: null },
//   { date: '2018-10-02 00:00:00', value: 4.063 },
//   { date: '2018-10-03 00:00:00', value: 3.209 },
//   { date: '2018-10-04 00:00:00', value: 4.355 },
//   ...
// ]

// Use a custom time period
data = await session.getDailyData({
  start: '24/08/2018',
  end: '06/09/2018'
});

```


## API

### `login(email, password)`

Log into you customer area and retrieve a session that you can use to retrieve your power consumption

### `session.getHourlyData([options])`

Retrieve power consumption with a step of 30 minutes

Default time period: *Yesterday*

### `session.getDailyData([options])`

Retrieve power consumption with a step of 1 day

You **cannot** retrieve more than 31 days at once

Default time period: *Last 31 days*

### `session.getMonthlyData([options])`

Retrieve power consumption with a step of 1 month

You **cannot** retrieve more than 12 months at once

Default time period: *Last 12 months*

### `session.getYearlyData([options])`

Retrieve **all** your power consumption with a step of 1 year

You cannot use a custom time period

[build-src]: https://flat.badgen.net/travis/bokub/linky
[build-href]: https://travis-ci.org/bokub/linky
[version-src]: https://flat.badgen.net/npm/v/@bokub/linky
[version-href]: https://www.npmjs.com/package/@bokub/linky
[engine-src]: https://flat.badgen.net/npm/node/@bokub/linky?color=cyan
[engine-href]: https://www.npmjs.com/package/@bokub/linky
