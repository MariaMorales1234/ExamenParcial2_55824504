import path from "node:path";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import itemsRouter from "./routes/items.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

const PUBLIC_PATH = path.join(import.meta.dirname, "..", "public");

const app = express();

// ---- Middlewares globales ----------------------------------------------
// Se ejecutan en orden, uno tras otro, en CADA petición.

// morgan: reemplaza el console.log manual que teníamos en server.js
app.use(morgan("dev"));

// cors: permite que otro origen (ej. otra app) consuma nuestra API
app.use(cors());

// express.json(): lee el body y lo deja listo en req.body
// (antes lo armábamos a mano con req.on("data") + JSON.parse)
app.use(express.json());

// Archivos estáticos: reemplaza todo el bloque de MIME_TYPES + fs.readFile
app.use(
    express.static(PUBLIC_PATH, {
        // El service worker debe poder actualizarse: nunca lo cacheamos en el navegador
        setHeaders(res, filePath) {
            if (filePath.endsWith("sw.js")) {
                res.setHeader("Cache-Control", "no-cache");
            }
        }
    })
);

// ---- Rutas de la API ----------------------------------------------------
app.use("/api/items", itemsRouter);

// ---- Manejo de errores (siempre al final) -------------------------------
app.use(notFound);
app.use(errorHandler);

export default app;