# Linky

[![Version][version-src]][version-href]
[![Build Status][build-src]][build-href]
[![Coverage][coverage-src]][coverage-href]
[![Code style][style-src]][style-href]

> **N.B**: Because this tool is targeted for french people, the documentation is...in french

Ce module vous permet de récupérer votre consommation électrique Linky via les nouvelles API _"Authorize V1"_ et _"Metering Data V4"_ d'Enedis

<p align="center">
  <img src="https://user-images.githubusercontent.com/17952318/93326183-b5ba2400-f818-11ea-85cf-c278a1e32b58.gif" alt="Screenshot">
</p>

Il peut s'utiliser de 2 façons :

1. [En ligne de commande](#1-linky-en-ligne-de-commande)
2. [En tant que module Node.js](#2-linky-comme-module-nodejs), depuis un autre programme

Notez qu'il vous faut un compteur Linky et un espace client Enedis pour pouvoir utiliser ce module

## 1. Linky en ligne de commande

### Installation

Si vous avez Node.js sur votre machine :

```bash
npm i -g @bokub/linky@beta
```

Dans le cas contraire, vous pouvez télécharger le binaire correspondant à votre plateforme dans les [assets de la dernière release](https://github.com/bokub/linky/releases).

> **N.B :** Si vous choisissez d'utiliser un binaire, il faudra adapter les exemples de cette documentation en replaçant la commande `linky` par le nom du binaire.
>
> Par exemple, au lieu de faire `linky --help`, il faudra faire `./linky-win.exe --help`

### Utilisation

Avant toute chose, il faudra vous connecter à votre espace client Enedis et leur donner l'autorisation de partager vos données avec une application extérieure.

Rendez-vous sur [linky-auth.vercel.app](https://linky-auth.vercel.app) pour donner votre accord et récupérer un jeu de tokens.

Puis, créez une connexion à votre compte avec la commande suivante:

```bash
linky auth -a <access token> -r <refresh token> -u <usage point ID>
```

Si tout se passe bien, vous pourrez alors récupérer votre consommation quotidienne, votre courbe de charge (consommation par demi-heure), et votre consommation maximale par jour.

```bash
# Récupère la consommation quotidienne du 1er au 7 septembre 2020 inclus
linky daily --start 2020-09-01 --end 2020-09-08

# Récupère la puissance moyenne consommée le 1er semptembre 2020, sur un intervalle de 30 min
linky loadcurve --start 2020-09-01 --end 2020-09-02

# Récupère la puissance maximale de consommation atteinte quotidiennement du 24 au 31 août inclus
linky maxpower --start 2020-08-24 --end 2020-09-01
```

Vous pouvez sauvegarder vos résultats dans un fichier JSON grâce à l'option `--output`

```bash
linky loadcurve --start 2020-09-01 --end 2020-09-02 --output data/ma_conso.json
```

Pour voir l'aide détaillée :

```bash
linky --help
```

## 2. Linky comme module Node.js

### Installation

```bash
# Depuis un projet Node.js
npm i @bokub/linky
```

### Utilisation

```js
const linky = require('@bokub/linky');

// Créez une session
const session = new linky.Session({
    accessToken: 'access token',
    refreshToken: 'refresh token',
    usagePointId: 'usage point ID',
    onTokenRefresh: (accessToken, refreshToken) => {
        // Cette fonction sera appellée si les tokens sont rafaîchis
        // Les tokens précédents ne seront plus valides
        // Il faudra utiliser ces nouveaux tokens à la prochaine création de session
    },
});

// Récupère la consommation quotidienne du 1er au 7 septembre 2020 inclus
session.getDailyConsumption('2020-09-01', '2020-09-08').then((result) => {
    console.log(result);
    /*
    {
        "unit": "Wh",
        "data": [
            { "date": "2020-09-01", "value": 12278 },
            { "date": "2020-09-02", "value": 15637 },
            ...
    */
});

// Récupère la puissance moyenne consommée le 1er semptembre 2020, sur un intervalle de 30 min
session.getLoadCurve('2020-09-01', '2020-09-02').then((result) => {
    console.log(result);
    /*
    {
        "unit": "W",
        "data": [
            { "date": "2020-09-01 00:00:00", "value": 582 },
            { "date": "2020-09-01 00:30:00", "value": 448 },
            ...
    */
});

// Récupère la puissance maximale de consommation atteinte quotidiennement du 24 au 31 août inclus
session.getMaxPower('2020-08-24', '2020-09-01').then((result) => {
    console.log(result);
    /*
    {
        "unit": "VA",
        "data": [
            { "date": "2020-08-24 13:54:04", "value": 1941 },
            { "date": "2020-08-25 01:48:26", "value": 1648 },
            ...
    */
});
```

[build-src]: https://flat.badgen.net/travis/bokub/linky
[build-href]: https://travis-ci.org/bokub/linky
[version-src]: https://runkit.io/bokub/npm-version/branches/master/%40bokub%2Flinky?style=flat
[version-href]: https://www.npmjs.com/package/@bokub/linky
[coverage-src]: https://flat.badgen.net/codecov/c/github/bokub/linky
[coverage-href]: https://codecov.io/gh/bokub/linky
[style-src]: https://flat.badgen.net/badge/code%20style/prettier/ff69b4
[style-href]: https://github.com/prettier/prettier
