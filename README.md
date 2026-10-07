# Linky

[![Version](https://gradgen.bokub.workers.dev/npm/v/linky?gradient=b65cff,11cbfa&style=flat&label=version)](https://www.npmjs.com/package/linky)
[![Build Status](https://flat.badgen.net/github/checks/bokub/linky?label=tests)](https://github.com/bokub/linky/actions/workflows/run.yml?query=branch%3Amaster)
[![Codecov](https://img.shields.io/codecov/c/github/bokub/linky?style=flat-square)](https://codecov.io/gh/bokub/linky)
[![Downloads](https://flat.badgen.net/npm/dy/linky?color=FF9800)](https://www.npmjs.com/package/linky)
![Node version](https://flat.badgen.net/badge/Node.js/>=%2016/blue)
[![Code style](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/bokub/prettier-config)

> **N.B**: Because this tool is targeted for french people, the documentation is...in french

> **N.B 2**: À partir d'octobre 2026, la version 2 ne fonctionnera plus, car les anciennes API Enedis seront arrêtées. Utilisez la version 3 de `linky` pour continuer à récupérer vos données.

<p align="center">
  <img src="https://github.com/bokub/linky/assets/17952318/15aa5983-6c56-4ef0-b2e2-c663bf7f7087" alt="Linky CLI">
</p>

Ce module vous permet de récupérer votre consommation et production électrique Linky via le service [Conso API](https://conso.boris.sh/)

Il peut s'utiliser de 2 façons :

1. [En ligne de commande](#1-linky-en-ligne-de-commande)
2. [En tant que module Node.js](#2-linky-comme-module-nodejs), depuis un autre programme

Notez qu'il vous faut un compteur Linky et un espace client Enedis pour pouvoir utiliser ce module

## 1. Linky en ligne de commande

### Installation

1. Installez [Node.js](https://nodejs.org/fr/download) sur votre machine. La version minimale supportée est Node 16.
   - [Instructions Debian, Ubuntu & Mint](https://github.com/nodesource/distributions#installation-instructions)
   - [Installateur Windows](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x86.msi)
   - [Installateur MacOS](https://nodejs.org/dist/v18.16.0/node-v18.16.0.pkg)
2. Ouvrez un terminal
3. Installez `linky` avec `npm`:

```bash
npm i -g linky
```

### Utilisation

#### Authentification

Avant toute chose, il faudra vous connecter à votre espace client Enedis et leur donner l'autorisation de partager vos données avec une application extérieure

Rendez-vous sur [conso.boris.sh](https://conso.boris.sh) pour donner votre accord et récupérer un token

Puis, créez une connexion à votre compte avec la commande suivante :

```bash
linky auth --token <votre-token>
```

#### Récupération des données

Une fois votre token sauvegardé, vous pourrez récupérer votre consommation quotidienne, votre courbe de charge (consommation par demi-heure), et votre consommation maximale par jour

```bash
# Récupère la consommation quotidienne du 1er au 3 mai 2026
linky daily --start 2026-05-01 --end 2026-05-04

# Récupère la puissance moyenne consommée le 1 mai 2026, sur un intervalle de 30 min
linky loadcurve --start 2026-05-01 --end 2026-05-02

# Récupère la puissance maximale de consommation atteinte quotidiennement du 1er au 3 mai 2026
linky maxpower --start 2026-05-01 --end 2026-05-04

# Récupère la puissance maximale mensuelle (P1M) pour la grandeur PMA
linky maxpower --start 2026-01-01 --end 2026-11-01 --pas P1M --grandeur-physique PMA
```

Si vous produisez de l'électricité, vous pouvez également récupérer votre production quotidienne et votre courbe de charge (production par demi-heure)

```bash
# Récupère la production quotidienne du 1er au 3 mai 2026
linky dailyprod --start 2026-05-01 --end 2026-05-04

# Récupère la puissance moyenne produite le 1 mai 2026, sur un intervalle de 30 min
linky loadcurveprod --start 2026-05-01 --end 2026-05-02
```

#### Dates par défaut

En l'absence des paramètres `--start` et `--end`, vous récupérez la consommation / production / puissance de la veille

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
linky daily --start 2026-05-01 --end 2026-05-02 --format json
```

Vous pouvez sauvegarder vos résultats dans un fichier en combinant les paramètres `--output` et `--format`

```bash
# Sauvegarde la courbe de charge de la veille au format JSON
linky loadcurve --output chemin/vers/ma_conso.json --format json

# Sauvegarde une semaine de consommation au format CSV
linky daily --start 2026-05-01 --end 2026-05-07 --output chemin/vers/ma_conso.csv --format csv
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
import { Session } from 'linky';

// Créez une session à partir du token
const token = 'xxx.yyy.zzz';
let session = new Session(token);

// Si le token permet d'accéder à plusieurs PRMs, vous pouvez préciser celui à utiliser
const prm = '123456';
session = new Session(token, prm);

// Si vous prévoyez de rendre votre application/service/module accessible au grand public,
// ajoutez un User-Agent au format string à la session.
// Celui-ci doit permettre d'identifier l'origine des requêtes envoyées à Conso API.
session.userAgent = 'Mon super service';

// Récupère la consommation quotidienne du 1er au 3 mai 2026
session.getDailyConsumption('2026-05-01', '2026-05-04').then((result) => {
  console.log(result);
  /*
   {
     "periode": { "dateDebut": "2026-05-01", "dateFin": "2026-05-04" },
     "pas": "P1D",
     "grandeur": [
       {
         "grandeurMetier": "CONS",
         "grandeurPhysique": "EA",
         "unite": "Wh",
         "points": [
           { "v": "6261", "d": "2026-05-01" },
           { "v": "4882", "d": "2026-05-02" },
           { "v": "6291", "d": "2026-05-03" }
         ],
         "calendrier": []
       }
     ],
     ...
   }
    */
});

// Récupère la puissance moyenne consommée le 1er mai 2026, sur un intervalle de 30 min
session.getLoadCurve('2026-05-01', '2026-05-02').then((result) => {
  console.log(result);
  /*
   {
     "periode": { "dateDebut": "2026-05-01", "dateFin": "2026-05-02" },
     "grandeur": [
       {
         "grandeurMetier": "CONS",
         "grandeurPhysique": "PA",
         "unite": "W",
         "points": [
           { "v": "108", "d": "2026-05-01 00:30:00", "p": "PT30M", "n": "B", "iv": "0", "ec": "0" },
           { "v": "156", "d": "2026-05-01 01:00:00", "p": "PT30M", "n": "B", "iv": "0", "ec": "0" },
           { "v": "166", "d": "2026-05-01 01:30:00", "p": "PT30M", "n": "B", "iv": "0", "ec": "0" },
           ...
         ]
       }
     ],
     ...
   }
    */
});

// Récupère la puissance maximale de consommation atteinte quotidiennement du 1er au 3 mai 2026
session.getMaxPower('2026-05-01', '2026-05-04').then((result) => {
  console.log(result);
  /*
   {
     "periode": { "dateDebut": "2026-05-01", "dateFin": "2026-05-04" },
     "pas": "P1D",
     "grandeur": [
       {
         "grandeurMetier": "CONS",
         "grandeurPhysique": "PMA",
         "unite": "VA",
         "points": [
           { "v": "2475", "d": "2026-05-01 04:40:46" },
           { "v": "2418", "d": "2026-05-02 04:10:18" },
           { "v": "3325", "d": "2026-05-03 22:10:33" }
         ]
       }
     ],
     ...
   }
    */
});

// Récupère la production quotidienne du 1er au 3 mai 2026
session.getDailyProduction('2026-05-01', '2026-05-04').then((result) => {
  console.log(result);
  /*
   {
     "periode": { "dateDebut": "2026-05-01", "dateFin": "2026-05-04" },
     "pas": "P1D",
     "grandeur": [
       {
         "grandeurMetier": "PROD",
         "grandeurPhysique": "EA",
         "unite": "Wh",
         "points": [
           { "v": "11339", "d": "2026-05-01" },
           { "v": "890", "d": "2026-05-02" },
           { "v": "8530", "d": "2026-05-03" }
         ]
       }
     ],
     ...
   }
    */
});

// Récupère la puissance moyenne produite le 1er mai 2026, sur un intervalle de 30 min
session.getProductionLoadCurve('2026-05-01', '2026-05-02').then((result) => {
  console.log(result);
  /*
   {
     "periode": { "dateDebut": "2026-05-01", "dateFin": "2026-05-02" },
     "grandeur": [
       {
         "grandeurMetier": "PROD",
         "grandeurPhysique": "PA",
         "unite": "W",
         "points": [
           { "v": "0", "d": "2026-05-01 00:30:00", "p": "PT30M", "n": "B", "iv": "0", "ec": "0" },
           { "v": "0", "d": "2026-05-01 01:00:00", "p": "PT30M", "n": "B", "iv": "0", "ec": "0" },
           { "v": "0", "d": "2026-05-01 01:30:00", "p": "PT30M", "n": "B", "iv": "0", "ec": "0" }
           ...
         ]
       }
     ],
     ...
   }
    */
});
```
