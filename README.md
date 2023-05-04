# Linky

[![Version](https://runkit.io/bokub/npm-version/branches/master/linky?style=flat)](https://www.npmjs.com/package/linky)
[![Build Status](https://flat.badgen.net/github/checks/bokub/linky?label=tests)](https://github.com/bokub/linky/actions/workflows/run.yml?query=branch%3Amaster)
[![Codecov](https://flat.badgen.net/codecov/c/github/bokub/linky/master)](https://codecov.io/gh/bokub/linky)
[![Downloads](https://flat.badgen.net/npm/dy/linky?color=FF9800)](https://www.npmjs.com/package/linky)
[![Code style](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/bokub/prettier-config)

> **N.B**: Because this tool is targeted for french people, the documentation is...in french

Ce module vous permet de récupérer votre consommation et production électrique Linky via les API _"Token V3"_ et _"Metering Data V5"_ d'Enedis

### Attention : Cette documentation est valable uniquement pour la version 2 du module. La documentation pour la version 1 est toujours disponible sur la [branche v1](https://github.com/bokub/linky/tree/v1#readme)

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
npm i -g linky
```

Dans le cas contraire, vous pouvez télécharger le binaire correspondant à votre plateforme dans les [assets de la dernière release](https://github.com/bokub/linky/releases/latest).

> **N.B :** Si vous choisissez d'utiliser un binaire, il faudra adapter les exemples de cette documentation en replaçant la commande `linky` par le nom du binaire.
>
> Par exemple, au lieu de faire `linky --help`, il faudra faire `./linky-win.exe --help`

### Utilisation

#### Authentification

Avant toute chose, il faudra vous connecter à votre espace client Enedis et leur donner l'autorisation de partager vos données avec une application extérieure.

Rendez-vous sur [conso.boris.sh](https://conso.boris.sh) pour donner votre accord et récupérer un token

Puis, créez une connexion à votre compte avec la commande suivante:

```bash
linky auth --token <votre-token>
```

#### Récupération des données

Une fois votre token sauvegardé, vous pourrez récupérer votre consommation quotidienne, votre courbe de charge (consommation par demi-heure), et votre consommation maximale par jour.

```bash
# Récupère la consommation quotidienne du 1er au 3 mai 2023 inclus
linky daily --start 2023-05-01 --end 2023-05-04

# Récupère la puissance moyenne consommée le 1 mai 2023, sur un intervalle de 30 min
linky loadcurve --start 2023-05-01 --end 2023-05-02

# Récupère la puissance maximale de consommation atteinte quotidiennement du 1er au 3 mai 2023 inclus
linky maxpower --start 2023-05-01 --end 2023-05-04
```

Si vous produisez de l'électricité, vous pouvez également récupérer votre production quotidienne et votre courbe de charge (production par demi-heure).

```bash
# Récupère la production quotidienne du 1er au 3 mai 2023 inclus
linky dailyprod --start 2023-05-01 --end 2023-05-04

# Récupère la puissance moyenne produite le 1 mai 2023, sur un intervalle de 30 min
linky loadcurveprod --start 2023-05-01 --end 2023-05-02
```

#### Dates par défaut

En l'absence des paramètres `--start` et `--end`, vous récupérez la consommation / production / puissance de la veille.

```bash
# Récupère la consommation de la journée d'hier
linky daily

# Récupère la puissance moyenne consommée pendant la journée d'hier, sur un intervalle de 30 min
linky loadcurve

# Récupère la puissance maximale de consommation atteinte durant la journée d'hier
linky maxpower

# Récupère la production de la journée d'hier
linky dailyprod

# Récupère la production moyenne consommée pendant la journée d'hier, sur un intervalle de 30 min
linky loadcurveprod
```

#### Multi-PRM et multi-token

Si votre token donne accès aux données de plusieurs PRMs, vous pouvez préciser le numéro de PRM à utiliser dans chaque commande avec le paramètre `--prm`

```bash
# Récupère la consommation de la veille pour le compteur 111222333
linky daily --prm 111222333

# Récupère la production de la veille pour le compteur 777888999
linky dailyprod --prm 777888999
```

Si vous possédez plusieurs tokens, vous pouvez passer l'étape d'authentification et préciser le token à utiliser dans chaque commande avec le paramètre `--token`

```bash
# Récupère la consommation de la veille avec le token aaa.bbb.ccc
linky daily --token aaa.bbb.ccc

# Récupère la production de la veille avec le token xxx.yyy.zzz
linky dailyprod --token xxx.yyy.zzz
```

#### Paramètres supplémentaires

Vous pouvez changer le format d'affichage de sortie grâce au paramètre `--format`

Les formats disponibles sont `json`, `csv` et `pretty` (par défaut)

```bash
linky daily --start 2023-05-01 --end 2023-05-02 --format json
```

Vous pouvez sauvegarder vos résultats dans un fichier en combinant les paramètres `--output` et `--format`

```bash
# Sauvegarde la courbe de charge de la veille au format JSON
linky loadcurve --output chemin/vers/ma_conso.json --format json

# Sauvegarde une semaine de consommation au format CSV
linky daily --start 2023-05-01 --end 2023-05-07 --output chemin/vers/ma_conso.csv --format csv
```

Vous pouvez masquer les messages et animations de progression grâce au paramètre `--quiet` afin de faciliter l'intégration dans des scripts

```bash
linky maxpower --quiet --format json | jq '.interval_reading[0].value'
```

Pour voir l'aide détaillée et plus d'exemples :

```bash
linky --help
```

## 2. Linky comme module Node.js

### Installation

```bash
# Depuis un projet Node.js
npm i linky
```

### Utilisation

```js
const linky = require('linky');
// Ou import linky from 'linky';

// Créez une session à partir du token
const token = 'xxx.yyy.zzz';
let session = new linky.Session(token);

// Si le token permet d'accéder à plusieurs PRMs, vous pouvez préciser celui à utiliser
const prm = '123456';
session = new linky.Session(token, prm);

// Récupère la consommation quotidienne du 1er au 3 mai 2023 inclus
session.getDailyConsumption('2023-05-01', '2023-05-04').then((result) => {
  console.log(result);
  /*
    {
      "reading_type": {
        "unit": "Wh",
        "measurement_kind": "energy"
      },
      "interval_reading": [
        { "value": "12873", "date": "2023-05-01" },
        { "value": "12296", "date": "2023-05-02" },
        { "value": "14679", "date": "2023-05-03" }
      ]
    ...
    */
});

// Récupère la puissance moyenne consommée le 1er mai 2023, sur un intervalle de 30 min
session.getLoadCurve('2023-05-01', '2023-05-02').then((result) => {
  console.log(result);
  /*
    {
      "reading_type": {
        "unit": "W",
        "measurement_kind": "power"
      },
      "interval_reading": [
        { "value": "752", "date": "2023-05-01 00:30:00" },
        { "value": "346", "date": "2023-05-01 01:00:00" },
        { "value": "250", "date": "2023-05-01 01:30:00" },
        ...
    */
});

// Récupère la puissance maximale de consommation atteinte quotidiennement du 1er au 3 mai 2023 inclus
session.getMaxPower('2023-05-01', '2023-05-04').then((result) => {
  console.log(result);
  /*
    {
      "reading_type": {
        "unit": "VA",
        "measurement_kind": "power"
      },
      "interval_reading": [
        { "value": "4638", "date": "2023-05-01 12:06:20" },
        { "value": "4410", "date": "2023-05-02 19:27:46" },
        { "value": "3570", "date": "2023-05-03 21:42:12" }
      ]
    ...
    */
});

// Récupère la production quotidienne du 1er au 3 mai 2023 inclus
session.getDailyProduction('2023-05-01', '2023-05-04').then((result) => {
  console.log(result);
  /*
    {
      "reading_type": {
        "unit": "Wh",
        "measurement_kind": "energy"
      },
      "interval_reading": [
        { "value": "12873", "date": "2023-05-01" },
        { "value": "12296", "date": "2023-05-02" },
        { "value": "14679", "date": "2023-05-03" }
      ]
    ...
    */
});

// Récupère la puissance moyenne produite le 1er mai 2023, sur un intervalle de 30 min
session.getProductionLoadCurve('2023-05-01', '2023-05-02').then((result) => {
  console.log(result);
  /*
    {
      "reading_type": {
        "unit": "W",
        "measurement_kind": "power"
      },
      "interval_reading": [
        { "value": "752", "date": "2023-05-01 00:30:00" },
        { "value": "346", "date": "2023-05-01 01:00:00" },
        { "value": "250", "date": "2023-05-01 01:30:00" },
        ...
    */
});
```
