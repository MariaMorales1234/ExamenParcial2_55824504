import { Router } from "express";
import { getAllItems, findItem, insertItem, modifyItem, removeItem } from "../db/db.js";

/**
 * Un Router de Express es un "mini servidor" que luego montamos en /api/items.
 * Compara esto con el archivo anterior: ya no parseamos req.url a mano,
 * ni acumulamos el body con req.on("data"), ni escribimos las cabeceras.
 */
const router = Router();

/**
 * Middleware propio: valida que el :id de la URL sea un número.
 * Al registrarlo con router.param() se ejecuta en TODAS las rutas que usen :id.
 */
router.param("id", (req, res, next, value) => {
    const id = Number(value);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "El id debe ser un número entero" });
    }
    req.itemId = id;
    next();
});

// GET /api/items
router.get("/", (req, res) => {
    res.json(getAllItems());
});

// GET /api/items/:id
router.get("/:id", (req, res) => {
    const item = findItem(req.itemId);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
});

// POST /api/items
router.post("/", async (req, res) => {
    const { name, description } = req.body ?? {};

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "El campo 'name' es obligatorio" });
    }

    const nuevo = await insertItem({ name: name.trim(), description: description?.trim() });
    res.status(201).json(nuevo);
});

// PUT /api/items/:id
router.put("/:id", async (req, res) => {
    const { name, description } = req.body ?? {};

    if (name !== undefined && !name.trim()) {
        return res.status(400).json({ error: "El campo 'name' no puede quedar vacío" });
    }

    // Solo mandamos los campos que vinieron en el body: así un PUT con
    // { description } no borra el name que ya tenía el item.
    const changes = {};
    if (name !== undefined) changes.name = name.trim();
    if (description !== undefined) changes.description = description.trim();

    const actualizado = await modifyItem(req.itemId, changes);
    if (!actualizado) return res.status(404).json({ error: "Item no encontrado" });
    res.json(actualizado);
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
    const eliminado = await removeItem(req.itemId);
    if (!eliminado) return res.status(404).json({ error: "Item no encontrado" });
    res.json({ mensaje: "Item eliminado", id: req.itemId });
});

export default router;