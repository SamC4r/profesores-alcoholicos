Este es un proyecto creado con Next.js

## Como ejecutar

Para arrancar la aplicacion, se debe ejecutar en la consola uno de estos comandos.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Durante el desarrollo se ha usado el `bun run dev` asi que se recomienda usar ese.


## Posibles Errores al Ejecutar

En caso de tener errores de falta de paquetes o algunas otras dependencias, se debe ejecutar

`bun install`  o  `npm install`

para instalarl los paquetes que faltan con las versiones de `package.json`

## Importante

Para que las APIs externas funcionen se debe tener un fichero `.env` en la raiz del proyecto `/`.

En este documento se deben incluir las siguientes claves de API (verificar que estan todas):

```bash

# Conexion con la base de datos
DATABASE_URL=...

# Para conectarse con la libreria que ayuda en la autenticacion de usuario
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=...


# Para envio de correos 
RESEND_API_KEY=...

# Para manejar las imagenes.
UPLOADTHING_TOKEN=...

```

La version final de la aplicacion se encuentra alojada en 

https://profesores-alcoholicos.vercel.app/
