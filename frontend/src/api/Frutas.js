// frontend/src/api/Frutas.js
import { getToken } from "./auth";

const API_URL = "http://localhost:5157/api/frutas";

// --- SafeFetch con logging y detección de HTML ---
async function safeFetch(url, options = {}) {
  console.group(`[safeFetch] Petición a: ${url}`);
  console.log("[safeFetch] Options:", options);

  try {
    const response = await fetch(url, options);
    let body = null;

    const contentType = response.headers.get("content-type") || "";
    console.log("[safeFetch] Content-Type:", contentType);

    if (contentType.includes("application/json")) {
      body = await response.json();
    } else if (contentType.includes("text/html")) {
      body = await response.text();
      console.warn("[safeFetch] Atención: respuesta HTML recibida (posible login):", body);
    } else {
      body = await response.text();
    }

    console.log("[safeFetch] Response status:", response.status);
    console.log("[safeFetch] Body:", body);

    return { response, body };
  } catch (err) {
    console.error("[safeFetch] Error en fetch:", err);
    return { response: null, body: null, error: err };
  } finally {
    console.groupEnd();
  }
}

// --- Headers con token JWT ---
function getAuthHeaders() {
  const token = getToken();
  console.log("[Frutas.js] Token obtenido:", token);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- OBTENER TODAS LAS FRUTAS ---
export async function getFrutas() {
  console.group("[Frutas.js] Llamada a getFrutas");
  try {
    const { response, body, error } = await safeFetch(API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (error) throw error;
    if (!response) throw new Error("No se recibió respuesta del servidor");

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error(`Respuesta HTML recibida (posible redirección a /Login). Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(body?.error || body?.message || `Error al obtener frutas (status: ${response.status})`);
    }

    if (Array.isArray(body)) return body;
    if (body?.data && Array.isArray(body.data)) return body.data;

    console.warn("[Frutas.js] Respuesta inesperada:", body);
    return [];
  } catch (err) {
    console.error("[Frutas.js] Excepción en getFrutas:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

// --- OBTENER Fruta POR ID ---
export async function getFruta(id) {
  if (!id) throw new Error("ID de fruta requerido");
  console.group(`[Frutas.js] Llamada a getFruta con id: ${id}`);
  try {
    const { response, body, error } = await safeFetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (error) throw error;
    if (!response) throw new Error("No se recibió respuesta del servidor");

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error(`Respuesta HTML recibida (posible redirección a /Login). Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(body?.error || body?.message || `Fruta no encontrada (status: ${response.status})`);
    }

    return body;
  } catch (err) {
    console.error("[Frutas.js] Excepción en getFruta:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

// --- BUSCAR Fruta POR TÉRMINO ---
export async function searchFruta(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") return [];
  console.group(`[Frutas.js] Llamada a searchFruta con término: "${searchTerm}"`);
  try {
    const { response, body, error } = await safeFetch(`${API_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (error) throw error;
    if (!response) throw new Error("No se recibió respuesta del servidor");

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error(`Respuesta HTML recibida (posible redirección a /Login). Status: ${response.status}`);
    }

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(body?.error || body?.message || `Error en la búsqueda (status: ${response.status})`);
    }

    if (Array.isArray(body)) return body;
    if (body?.data && Array.isArray(body.data)) return body.data;
    return [];
  } catch (err) {
    console.error("[Frutas.js] Excepción en searchFruta:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

// --- CREAR Fruta ---
export async function createFruta(fruta = {}, proveedor = null) {
  console.group("[Frutas.js] Llamada a createFruta", { fruta, proveedor });
  try {
    const bodyContent = JSON.stringify({ Fruta: fruta, Proveedor: proveedor });
    const { response, body, error } = await safeFetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: bodyContent,
    });

    if (error) throw error;
    if (!response) throw new Error("No se recibió respuesta del servidor");

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error(`Respuesta HTML recibida (posible redirección a /Login). Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(body?.error || "Error al crear fruta");
    }

    return body;
  } catch (err) {
    console.error("[Frutas.js] Excepción en createFruta:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

// --- ACTUALIZAR Fruta ---
export async function updateFruta(id, fruta = {}, proveedor = null) {
  if (!id) throw new Error("ID de fruta requerido");
  console.group(`[Frutas.js] Llamada a updateFruta con id: ${id}`, { fruta, proveedor });
  try {
    const bodyContent = JSON.stringify({ Fruta: fruta, Proveedor: proveedor });
    const { response, body, error } = await safeFetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: bodyContent,
    });

    if (error) throw error;
    if (!response) throw new Error("No se recibió respuesta del servidor");

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error(`Respuesta HTML recibida (posible redirección a /Login). Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(body?.error || "Error al actualizar fruta");
    }

    return body;
  } catch (err) {
    console.error("[Frutas.js] Excepción en updateFruta:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

// --- ELIMINAR Fruta ---
export async function deleteFruta(id) {
  if (!id) throw new Error("ID de fruta requerido");
  console.group(`[Frutas.js] Llamada a deleteFruta con id: ${id}`);
  try {
    const { response, body, error } = await safeFetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (error) throw error;
    if (!response) throw new Error("No se recibió respuesta del servidor");

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error(`Respuesta HTML recibida (posible redirección a /Login). Status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(body?.error || "Error al eliminar fruta");
    }

    return true;
  } catch (err) {
    console.error("[Frutas.js] Excepción en deleteFruta:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}
