/**
 * Middleware 404: se ejecuta si ninguna ruta anterior respondió.
 * En Express el orden importa: este va DESPUÉS de todas las rutas.
 */
export function notFound(req, res, next) {
    // Si la petición era a la API respondemos JSON...
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
    }
    // ...y si era una página, dejamos que Express siga (mostrará su 404 por defecto).
    next();
}

/**
 * Middleware de errores: Express lo reconoce porque recibe 4 parámetros (err primero).
 * Cualquier throw dentro de una ruta async de Express 5 termina aquí.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    console.error("💥 Error:", err.message);

    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Error interno del servidor"
    });
}