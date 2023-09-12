Ce dossier contient le code autrefois utilisé par [conso.vercel.app](https://conso.vercel.app).

## Fichiers HTML:

-   `index.html` contient le code HTML de la page d'accueil (toujours en ligne)
-   `tokens.html` contient le code HTML de la page qui affichait les tokens

## Dossier `api` (désormais hors service) :

-   `api/auth.ts` était appelé quand vous cliquiez sur le bouton de la page d'accueil. Il vous redirigeait vers votre espace personnel Enedis
-   `api/callback.ts` était appelé par Enedis lorsque vous aviez donné votre accord. Il rappelait Enedis pour générer des tokens puis les affichait à l'écran
-   `api/refresh.ts` était appelé automatiquement par le module npm `linky` lorsque vos tokens étaient expirés. Il générait de nouveaux tokens et les renvoyait au module
