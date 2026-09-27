import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm, showToast } from "./ui/ui.js";

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
let editingId = null;

/** Vuelve al modo "crear". */
function stopEditing() {
    editingId = null;
    resetForm(form, submitBtn, cancelBtn);
}

// Eventos de tabla (delegación: un solo listener para todas las filas)
tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-delete")) {
        try {
            await deleteItem(id);
            if (editingId === id) stopEditing();
            showToast("Item eliminado", "success");
            loadItems();
        } catch (err) {
            console.error("Error eliminando:", err);
            showToast(err.message);
        }
    } else if (btn.classList.contains("btn-edit")) {
        try {
            // Segundo clic en el mismo botón = cancelar la edición
            if (editingId === id) {
                stopEditing();
                return;
            }
            const item = await getItem(id);
            fillForm(form, item, submitBtn, cancelBtn);
            editingId = id;
        } catch (err) {
            console.error("Error cargando item:", err);
            showToast(err.message);
        }
    }
});

cancelBtn.addEventListener("click", stopEditing);

// Envío del form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const description = form.querySelector("#description").value.trim();

    if (!name) {
        showToast("El campo nombre es obligatorio");
        return;
    }

    try {
        if (editingId) {
            await updateItem(editingId, { name, description });
            showToast("Cambios guardados", "success");
        } else {
            await createItem({ name, description });
            showToast("Item agregado", "success");
        }

        stopEditing();
        loadItems();
    } catch (err) {
        console.error("Error guardando item:", err);
        showToast(err.message);
    }
});

// Cargar al inicio
async function loadItems() {
    try {
        const items = await getItems();
        renderItems(items, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        showToast(err.message);
    }
}

loadItems();