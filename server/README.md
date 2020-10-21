Ce dossier contient le code utilisé par [conso.vercel.app](https://conso.vercel.app).

## Fichiers HTML:

-   `index.html` contient le code HTML de la page d'accueil
-   `tokens.html` contient le code HTML de la page qui affiche les tokens

## Dossier `api`:

-   `api/auth.ts` est appelé quand vous cliquez sur le bouton de la page d'accueil. Il vous redirige vers votre espace personnel Enedis
-   `api/callback.ts` est appelé par Enedis lorsque vous avez donné votre accord. Il rappelle Enedis pour générer des tokens puis les affiche à l'écran
-   `api/refresh.ts` est appelé automatiquement par le module npm `linky` lorsque vos tokens sont expirés. Il génère de nouveaux tokens et les renvoie au module
