# Linky

[![Version][version-src]][version-href]
[![Build Status][build-src]][build-href]

> Récupération facile de la consommation éléctrique Linky

#### Pour un outil en ligne de commande, voir [linky-cli](https://github.com/bokub/linky-cli)

#### > [Read in english](https://github.com/bokub/linky/blob/master/README.md) <


## Installation

```
$ npm i @bokub/linky
```


## Utilisation

```js
const linky = require('@bokub/linky');

// Connexion
const session = await linky.login('my-email@example.com', 'password');

// Récupération de la consommation
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

// Utilisation d'une période de temps personnalisée
data = await session.getDailyData({
  start: '24/08/2018',
  end: '06/09/2018'
});

```


## API

### `login(email, motDePasse)`

Connexion à l'espace client, retourne une session à utiliser pour récupérer sa consommation énergétique

### `session.getHourlyData([options])`

Récupère la consommation d'énergie avec un pas de 30 minutes

Période par défaut: *Hier*

### `session.getDailyData([options])`

Récupère la consommation d'énergie avec un pas d'un jour
Il est **impossible** de récupérer plus de 31 jours d'un coup

Période par défaut: *31 derniers jours*

### `session.getMonthlyData([options])`

Récupère la consommation d'énergie avec un pas d'un mois
Il est **impossible** de récupérer plus de 12 mois d'un coup

Période par défaut: *12 derniers mois*

### `session.getYearlyData([options])`

Récupère **toute** la consommation d'énergie avec un pas d'un an

Il n'est pas possible d'utiliser une période de temps personnalisée

[build-src]: https://flat.badgen.net/travis/bokub/linky
[build-href]: https://travis-ci.org/bokub/linky
[version-src]: https://flat.badgen.net/npm/v/@bokub/linky
[version-href]: https://www.npmjs.com/package/@bokub/linky
