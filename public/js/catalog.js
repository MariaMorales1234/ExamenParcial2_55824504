import { getItems } from "./services/api.js";
import { showToast } from "./ui/ui.js";

// Seleccionar el contenedor donde se mostrarán los items
const catalogContainer = document.getElementById("catalogContainer");

// Función principal para cargar los items desde la API
async function loadCatalog() {
    try {
        // 1. Pedir los items con getItems()
        const items = await getItems();

        // 2. Limpiar el contenedor del catálogo
        catalogContainer.replaceChildren();

        // 3. Si el array viene vacío, mostrar un mensaje de "catálogo vacío"
        if (items.length === 0) {
            const emptyMessage = document.createElement("p");

            emptyMessage.textContent = "El catálogo está vacío.";
            emptyMessage.className = "text-center text-slate-500 p-4";

            catalogContainer.appendChild(emptyMessage);
            return;
        }

        // 4. Iterar sobre cada item y llamar a renderItem()
        items.forEach((item) => {
            renderItem(item);
        });

    } catch (err) {
        console.error("Error cargando catálogo:", err);

        // Mostrar el error en la UI
        showToast("No se pudo cargar el catálogo", "error");
    }
}

// Función para renderizar un item en el catálogo
function renderItem(item) {
    // Crear el elemento HTML
    const card = document.createElement("article");

    // Dar estilo con Tailwind
    card.className =
        "rounded-card border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md";

    // Crear nombre
    const name = document.createElement("h2");
    name.textContent = item.name;
    name.className = "text-lg font-semibold text-slate-900";

    // Crear descripción
    const description = document.createElement("p");
    description.textContent = item.description || "";
    description.className = "mt-2 text-sm text-slate-600";

    // Insertar los datos dentro de la tarjeta
    card.append(name, description);

    // Insertar la tarjeta en el contenedor
    catalogContainer.appendChild(card);
}

// Inicializar el catálogo cuando cargue la página
loadCatalog();