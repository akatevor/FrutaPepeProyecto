// frontend/src/api/fruta.js
import { getToken } from "./auth";

const API_URL = "http://localhost:5157/api/frutaapi";

// Devuelve headers con JWT si existe
function getAuthHeaders() {
  const token = getToken();
  console.log("[fruta.js] Token obtenido:", token);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- OBTENER TODAS LAS Frutas ---
export async function getFrutas() {
  console.log("[fruta.js] Llamando a GET Frutas...");
  try {
    const response = await fetch(API_URL, { headers: getAuthHeaders() });
    console.log("[fruta.js] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[fruta.js] Error al obtener frutas:", errorText);
      throw new Error("Error al obtener las frutas");
    }

    const data = await response.json();
    console.log("[fruta.js] Datos recibidos de frutas:", data);

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[fruta.js] Excepción en getFrutas:", err);
    throw err;
  }
}

// --- OBTENER Fruta POR ID ---
export async function getFruta(id) {
  if (!id) throw new Error("ID de fruta requerido");
  const idNum = Number(id); // aseguramos que sea número
  console.log("[fruta.js] Llamando a getFruta con id:", idNum);

  try {
    const response = await fetch(`${API_URL}/${idNum}`, { headers: getAuthHeaders() });
    console.log("[fruta.js] Response status getFruta:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[fruta.js] Error al obtener fruta por ID:", errorText);
      throw new Error("Fruta no encontrada");
    }

    const data = await response.json();
    console.log("[fruta.js] Datos recibidos getFruta:", data);
    return data;
  } catch (err) {
    console.error("[fruta.js] Excepción en getFruta:", err);
    throw err;
  }
}

// --- BUSCAR Fruta POR TÉRMINO ---
export async function searchFruta(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") return [];
  console.log("[fruta.js] Llamando a searchFruta con término:", searchTerm);

  try {
    const response = await fetch(`${API_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
      headers: getAuthHeaders(),
    });

    console.log("[fruta.js] Response status search:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("[fruta.js] No se encontraron frutas con el término:", searchTerm);
        return [];
      }
      const errorText = await response.text();
      console.error("[fruta.js] Error en searchFruta:", errorText);
      throw new Error("Error en la búsqueda de fruta");
    }

    const data = await response.json();
    console.log("[fruta.js] Resultados searchFruta:", data);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[fruta.js] Excepción en searchFruta:", err);
    throw err;
  }
}

// --- CREAR Fruta ---
export async function createFruta(fruta = {}, proveedor = null) {
  console.log("[fruta.js] Llamando a createFruta con datos:", { fruta, proveedor });

  try {
    const body = JSON.stringify({ Fruta: fruta, Proveedor: proveedor });
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body,
    });

    console.log("[fruta.js] Response status createFruta:", response.status);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[fruta.js] Error createFruta:", errData);
      throw new Error(errData.error || "Error al crear fruta");
    }

    const data = await response.json();
    console.log("[fruta.js] Fruta creada:", data);
    return data;
  } catch (err) {
    console.error("[fruta.js] Excepción en createFruta:", err);
    throw err;
  }
}

// --- ACTUALIZAR Fruta ---
export async function updateFruta(id, fruta = {}, proveedor = null) {
  if (!id) throw new Error("ID de fruta requerido");
  const idNum = Number(id);
  console.log("[fruta.js] Llamando a updateFruta con id:", idNum, "datos:", { fruta, proveedor });

  try {
    const body = JSON.stringify({ Fruta: fruta, Proveedor: proveedor });
    const response = await fetch(`${API_URL}/${idNum}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body,
    });

    console.log("[fruta.js] Response status updateFruta:", response.status);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[fruta.js] Error updateFruta:", errData);
      throw new Error(errData.error || "Error al actualizar fruta");
    }

    const data = await response.json();
    console.log("[fruta.js] Fruta actualizada:", data);
    return data;
  } catch (err) {
    console.error("[fruta.js] Excepción en updateFruta:", err);
    throw err;
  }
}

// --- ELIMINAR Fruta ---
export async function deleteFruta(id) {
  if (!id) throw new Error("ID de fruta requerido");
  const idNum = Number(id);
  console.log("[fruta.js] Llamando a deleteFruta con id:", idNum);

  try {
    const response = await fetch(`${API_URL}/${idNum}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    console.log("[fruta.js] Response status deleteFruta:", response.status);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[fruta.js] Error deleteFruta:", errData);
      throw new Error(errData.error || "Error al eliminar fruta");
    }

    console.log("[fruta.js] Fruta eliminada exitosamente");
    return true;
  } catch (err) {
    console.error("[fruta.js] Excepción en deleteFruta:", err);
    throw err;
  }
}
