# Linky

[![Version](https://runkit.io/bokub/npm-version/branches/master/linky?style=flat)](https://www.npmjs.com/package/linky)
[![Build Status](https://flat.badgen.net/github/checks/bokub/linky?label=tests)](https://github.com/bokub/linky/actions/workflows/run.yml?query=branch%3Amaster)
[![Codecov](https://flat.badgen.net/codecov/c/github/bokub/linky/master)](https://codecov.io/gh/bokub/linky)
[![Downloads](https://flat.badgen.net/npm/dy/linky?color=FF9800)](https://www.npmjs.com/package/linky)
[![Code style](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/bokub/prettier-config)

> **N.B**: Because this tool is targeted for french people, the documentation is...in french

Ce module vous permet de récupérer votre consommation et production électrique Linky via les anciennes API _"Authorize V1"_ et _"Metering Data V4"_ d'Enedis

### Attention : Cette documentation est valable uniquement pour la version 1 du module, qui ne fonctionnera plus après la désactivation de ces API par Enedis le 17 septembre 2023.

### Vous êtes vivement encouragé à utiliser la [version 2](https://github.com/bokub/linky#readme) dès que possible.

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

Avant toute chose, il faudra vous connecter à votre espace client Enedis et leur donner l'autorisation de partager vos données avec une application extérieure.

Rendez-vous sur [conso.vercel.app](https://conso.vercel.app) pour donner votre accord et récupérer un jeu de tokens.

Puis, créez une connexion à votre compte avec la commande suivante :

```bash
linky auth -a <access token> -r <refresh token> -u <usage point ID>
```

> **Attention :** Les tokens générés ont une durée de vie de quelques heures. Ils seront renouvelés automatiquement par cet outil et stockés sur votre ordinateur.
>
> Ne **relancez pas** `linky auth` avec de vieux tokens, cela rendrait votre connexion invalide et vous devrez recommencer le process depuis le début.

Une fois vos tokens sauvegardés, vous pourrez récupérer votre consommation quotidienne, votre courbe de charge (consommation par demi-heure), et votre consommation maximale par jour.

```bash
# Récupère la consommation quotidienne du 1er au 7 janvier 2022 inclus
linky daily --start 2022-01-01 --end 2022-01-08

# Récupère la puissance moyenne consommée le 31 décembre 2021, sur un intervalle de 30 min
linky loadcurve --start 2021-12-31 --end 2022-01-01

# Récupère la puissance maximale de consommation atteinte quotidiennement du 1er au 7 janvier 2022 inclus
linky maxpower --start 2022-01-01 --end 2022-01-08
```

Si vous produisez de l'électricité, vous pouvez également récupérer votre production quotidienne et votre courbe de charge (production par demi-heure).

```bash
# Récupère la production quotidienne du 1er au 7 janvier 2022 inclus
linky dailyprod --start 2022-01-01 --end 2022-01-08

# Récupère la puissance moyenne produite le 31 décembre 2021, sur un intervalle de 30 min
linky loadcurveprod --start 2021-12-31 --end 2022-01-01
```

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

Pour gérer plusieurs compteurs (PRM), précisez simplement l'usage point ID dans chaque commande avec le paramètre `-u`

```bash
# Enregistre les identifiants du compteur 111222333
linky auth -a Tk42pB -r 8peqHT -u 111222333

# Enregistre les identifiants du compteur 777888999
linky auth -a 9urfYR -r 5wcCPq -u 777888999

# Récupère la consommation du compteur 111222333
linky daily -u 111222333

# Récupère la production du compteur 777888999
linky dailyprod -u 777888999
```

Vous pouvez sauvegarder vos résultats dans un fichier JSON grâce à l'option `--output`

```bash
linky loadcurve --start 2021-12-31 --end 2022-01-01 --output data/ma_conso.json
```

Vous pouvez changer le format d'affichage de sortie grâce à l'option `--format`

```bash
linky daily --start 2022-01-01 --end 2022-01-08 --format json
```

Vous pouvez masquer les messages et animations de progression grâce à l'option `--quiet`

```bash
linky maxpower --quiet
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

// Créez une session
const session = new linky.Session({
    accessToken: 'access token',
    refreshToken: 'refresh token',
    usagePointId: 'usage point ID',
    onTokenRefresh: (accessToken, refreshToken) => {
        // Cette fonction sera appelée si les tokens sont renouvelés
        // Les tokens précédents ne seront plus valides
        // Il faudra utiliser ces nouveaux tokens à la prochaine création de session
        // Si accessToken et refreshToken sont vides, cela signifie que les tokens ne peuvent plus
        // être utilisés. Il faut alors en récupérer des nouveaux sur conso.vercel.app
    },
});

// Récupère la consommation quotidienne du 1er au 7 janvier 2022 inclus
session.getDailyConsumption('2022-01-01', '2022-01-08').then((result) => {
    console.log(result);
    /*
    {
        "unit": "Wh",
        "data": [
            { "date": "2022-01-01", "value": 12278 },
            { "date": "2022-01-02", "value": 15637 },
            ...
    */
});

// Récupère la puissance moyenne consommée le 31 décembre 2021, sur un intervalle de 30 min
session.getLoadCurve('2021-12-31', '2022-01-01').then((result) => {
    console.log(result);
    /*
    {
        "unit": "W",
        "data": [
            { "date": "2021-12-31 00:30:00", "value": 582 },
            { "date": "2021-12-31 01:00:00", "value": 448 },
            ...
    */
});

// Récupère la puissance maximale de consommation atteinte quotidiennement du 1er au 7 janvier 2022 inclus
session.getMaxPower('2022-01-01', '2022-01-08').then((result) => {
    console.log(result);
    /*
    {
        "unit": "VA",
        "data": [
            { "date": "2022-01-01 13:54:04", "value": 1941 },
            { "date": "2022-01-02 09:48:26", "value": 1648 },
            ...
    */
});

// Récupère la production quotidienne du 1er au 7 janvier 2022 inclus
session.getDailyProduction('2022-01-01', '2022-01-08').then((result) => {
    console.log(result);
    /*
  {
      "unit": "Wh",
      "data": [
          { "date": "2022-01-01", "value": 1278 },
          { "date": "2022-01-02", "value": 1567 },
          ...
  */
});

// Récupère la puissance moyenne produite le 31 décembre 2021, sur un intervalle de 30 min
session.getProductionLoadCurve('2021-12-31', '2022-01-01').then((result) => {
    console.log(result);
    /*
  {
      "unit": "W",
      "data": [
          { "date": "2021-12-31 00:30:00", "value": 82 },
          { "date": "2021-12-31 01:00:00", "value": 48 },
          ...
  */
});
```
