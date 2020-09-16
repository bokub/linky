Ce dossier contient le code utilisé par [linky-auth.vercel.app](https://linky-auth.vercel.app).

-   `index.html` contient le code HTML de la page d'accueil
-   `api/auth.ts` est appelé quand vous cliquez sur le bouton de la page d'accueil. Il vous redirige vers votre espace personnel Enedis
-   `api/index.ts` est appelé par Enedis lorsque vous avez donné votre accord. Il rappelle Enedis pour génèrer des tokens puis les affiche à l'écran
-   `api/refresh.ts` est appelé automatiquement par le module `@bokub/linky` lorsque vos tokens sont expirés. Il génère de nouveaux tokens et les renvoie au module
