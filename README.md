# ExamenParcial2_55824504
Examen parcial hecho por María José Morales López

## Requisitos

- Node.js **20.11 o superior** (`node -v`)
- npm 10+

## Puesta en marcha

```bash
git clone https://github.com/MariaMorales1234/ExamenParcial2_55824504.git
cd ExamenParcial2_55824504

npm install          # instala todo lo que dice package.json
cp .env.example .env # crea tu configuración local

npm run dev          # arranca API + compilador de CSS
```

Abre <http://localhost:3000>.

> **¿Página sin estilos?** El archivo `public/css/styles.css` **no está en el repo**:
> lo genera Tailwind. Corre `npm run dev` (o `npm run build`) y aparece.

## Scripts de npm

| Script             | Qué hace                                                        |
| ------------------ | --------------------------------------------------------------- |
| `npm run dev`      | Servidor con recarga (nodemon) **+** Tailwind en modo `--watch` |
| `npm start`        | Servidor en modo producción, sin recarga                        |
| `npm run build`    | Compila y minifica el CSS. Obligatorio antes de desplegar       |
| `npm run lint`     | Revisa el código con ESLint                                     |
| `npm run lint:fix` | Arregla lo que ESLint pueda arreglar solo                       |

## Estructura

```
src/                     # Todo lo que corre en Node (nunca llega al navegador)
├── server.js            # Arranque: lee .env y levanta el puerto
├── app.js               # La app de Express: middlewares y montaje de rutas
├── routes/items.js      # Router del CRUD (/api/items)
├── db/db.js             # Acceso a datos con lowdb
├── middlewares/errors.js# 404 y manejador de errores
├── data/items.json      # La "base de datos"
└── styles/input.css     # FUENTE del CSS (Tailwind). Este es el que se edita

public/                  # Todo lo que se envía al navegador
├── index.html           # Vista de gestión (CRUD)
├── catalog.html         # Vista de catálogo (ejercicio pendiente)
├── offline.html         # Se muestra si no hay red ni caché
├── manifest.webmanifest # Metadatos de la PWA (nombre, iconos, colores)
├── sw.js                # Service worker: caché y modo offline
├── icons/               # Iconos de instalación
├── css/styles.css       # CSS GENERADO (está en .gitignore)
└── js/
    ├── main.js          # Lógica de la vista de gestión
    ├── catalog.js       # Ejercicio: completar los TODO
    ├── pwa.js           # Registro del SW, botón instalar, aviso offline
    ├── services/api.js  # Llamadas a la API
    └── ui/ui.js         # Render del DOM
```

## API

Base: `/api/items`

| Método   | Ruta   | Body                      | Respuesta                    |
| -------- | ------ | ------------------------- | ---------------------------- |
| `GET`    | `/`    | —                         | `200` lista de items         |
| `GET`    | `/:id` | —                         | `200` item · `404` no existe |
| `POST`   | `/`    | `{ name, description? }`  | `201` item creado · `400`    |
| `PUT`    | `/:id` | `{ name?, description? }` | `200` item · `404` · `400`   |
| `DELETE` | `/:id` | —                         | `200` `{ mensaje }` · `404`  |

Los errores siempre vienen como `{ "error": "mensaje" }`.

## Probar la PWA

1. `npm run build` y luego `npm start`.
2. Abre Chrome → **DevTools → Application**.
3. **Manifest**: revisa nombre e iconos. **Service Workers**: debe decir _activated_.
4. Marca **Offline** en la pestaña _Network_ y recarga: la app sigue abriendo.
5. El botón **Instalar app** de la navbar aparece cuando el navegador acepta la PWA.

> La instalación solo funciona en `localhost` o con **HTTPS**. Para probar desde el
> celular en la misma red, usa un túnel (`npx localtunnel --port 3000`) o despliega.