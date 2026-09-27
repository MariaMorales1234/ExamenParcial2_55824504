const API_URL = "/api/items";

/**
 * Helper compartido: hace el fetch, y si el servidor respondió con error
 * intenta leer el mensaje que viene en el JSON ({ "error": "..." }).
 */
async function request(url, options) {
    const res = await fetch(url, options);

    if (!res.ok) {
        let message = `Error ${res.status}`;
        try {
            const body = await res.json();
            if (body.error) message = body.error;
        } catch {
            // La respuesta no era JSON (ej. estamos sin conexión): dejamos el mensaje genérico.
        }
        throw new Error(message);
    }

    return res.json();
}

// Cabecera reutilizada por POST y PUT
const JSON_HEADERS = { "Content-Type": "application/json" };

export function getItems() {
    return request(API_URL);
}

export function getItem(id) {
    return request(`${API_URL}/${id}`);
}

export function createItem(data) {
    return request(API_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export function updateItem(id, data) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export function deleteItem(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
}