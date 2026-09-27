import "dotenv/config"; // carga las variables de .env en process.env
import app from "./app.js";

// process.env.PORT viene del archivo .env; el 3000 es el valor por defecto.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   Entorno: ${process.env.NODE_ENV || "development"}`);
});