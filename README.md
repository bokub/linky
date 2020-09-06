# Linky

[![Version][version-src]][version-href]
[![Build Status][build-src]][build-href]
[![Engines][engine-src]][engine-href]
[![Coverage][coverage-src]][coverage-href]
![Code style][style-src]

> Easily retrieve your Linky power consumption

#### If you are looking for a command-line tool, check out [linky-cli](https://github.com/bokub/linky-cli)

## Install

```
$ npm i @bokub/linky
```

## Usage

```js
const linky = require('@bokub/linky');

// Log in
linky.login('my-email@example.com', 'password').then((session) => {
    // Retrieve your power consumption
    session.getDailyData().then((data) => {
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
    });

    // Use a custom time period
    session.getDailyData({ start: '24/08/2018', end: '06/09/2018' }).then((data) => {
        console.log(data);
    });
});
```

## API

### `login(email, password)`

Log into you customer area and retrieve a session that you can use to retrieve your power consumption

### `session.getHourlyData([options])`

Retrieve power consumption with a step of 30 minutes

Default time period: _Yesterday_

### `session.getDailyData([options])`

Retrieve power consumption with a step of 1 day

You **cannot** retrieve more than 31 days at once

Default time period: _Last 31 days_

### `session.getMonthlyData([options])`

Retrieve power consumption with a step of 1 month

You **cannot** retrieve more than 12 months at once

Default time period: _Last 12 months_

### `session.getYearlyData([options])`

Retrieve **all** your power consumption with a step of 1 year

You cannot use a custom time period

[build-src]: https://flat.badgen.net/travis/bokub/linky
[build-href]: https://travis-ci.org/bokub/linky
[version-src]: https://flat.badgen.net/npm/v/@bokub/linky
[version-href]: https://www.npmjs.com/package/@bokub/linky
[engine-src]: https://flat.badgen.net/badge/node/%3E=%207.6.0?color=cyan
[engine-href]: https://www.npmjs.com/package/@bokub/linky
[coverage-src]: https://flat.badgen.net/codecov/c/github/bokub/linky
[coverage-href]: https://codecov.io/gh/bokub/linky
[style-src]: https://flat.badgen.net/badge/code%20style/XO?color=5ED9C7
