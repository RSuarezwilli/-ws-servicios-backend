# WS. SERVICIOS — Sitio + Backend

Este proyecto une tu página web (`public/`) con un backend en Node.js + Express
que guarda cada solicitud del formulario en un archivo local (`solicitudes.json`)
y te avisa por correo cuando llega una nueva.

Este proyecto usa **ES Modules** (`import`/`export`), la sintaxis moderna de
JavaScript, en vez de `require`/`module.exports`.

## Estructura

```
ws-backend/
  server.js        → servidor Express (rutas y arranque)
  db.js             → conexión y consultas a la base de datos SQLite
  mailer.js         → envío del correo de notificación
  .env.example      → plantilla de variables de entorno
  public/           → tu sitio web (index.html, style.css, script.js)
```

## 1. Requisitos

Necesitas tener instalado **Node.js** (versión 18 o más reciente).
Verifícalo en una terminal con:

```
node -v
```

Si no lo tienes, descárgalo de https://nodejs.org

## 2. Instalar dependencias

Abre una terminal dentro de la carpeta `ws-backend` y ejecuta:

```
npm install
```

Esto instala Express, nodemailer, dotenv y nodemon.

## 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```
cp .env.example .env
```

Abre `.env` y ajusta:

- `ADMIN_TOKEN`: una palabra secreta que tú inventes, para entrar al panel de solicitudes.
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL`: datos de correo, **opcional al inicio**.
  Si los dejas vacíos o de ejemplo, el sistema sigue funcionando: en vez de
  enviar el correo, simplemente imprime la notificación en la consola. Así
  puedes probar todo antes de configurar el correo real.

  Si usas Gmail, necesitas una "contraseña de aplicación" (no tu contraseña normal):
  https://myaccount.google.com/apppasswords

## 4. Correr el proyecto en local

```
npm run dev
```

Verás algo como:

```
Servidor corriendo en http://localhost:3000
Panel de solicitudes en http://localhost:3000/admin?token=cambia-esto-por-algo-secreto
```

Abre `http://localhost:3000` en el navegador: ahí está tu página, ya conectada
al backend. Llena el formulario y dale a "Enviar solicitud" — debe guardarse
y (si configuraste el correo) llegarte una notificación.

## 5. Ver las solicitudes guardadas

Entra a `http://localhost:3000/admin?token=TU_TOKEN` (el mismo que pusiste en
`.env`) para ver la lista de todas las solicitudes recibidas, en una tabla simple.

También puedes abrir directamente el archivo `solicitudes.json` que se crea
solo en la carpeta del proyecto la primera vez que alguien envía el formulario.

## 6. Siguiente paso: subirlo a internet

Cuando quieras que la página sea visible para cualquiera (no solo en tu
computador), puedes desplegar este mismo proyecto en un servicio como
Render, Railway o Fly.io. Cuando llegues a ese punto, avísame y te guío
con el proceso paso a paso — cambia un poco según dónde lo subas.

## Notas de seguridad para cuando esto sea público

- Cambia `ADMIN_TOKEN` por algo largo y difícil de adivinar.
- No subas el archivo `.env` a ningún repositorio (ya está en `.gitignore`).
- Considera agregar límites de envíos (rate limiting) para evitar spam en el formulario.
