// src/api/frutas.js
import axios from "axios";

// URL base del backend ASP.NET
const API_URL = "http://localhost:5157/api/fruta";

// helper para normalizar errores de axios
function formatAxiosError(err) {
  const e = new Error(err.message || "Network error");
  if (err.response) {
    e.status = err.response.status;
    e.body = err.response.data;
    e.message =
      (err.response.data && (err.response.data.error || err.response.data.message)) ||
      err.message;
  } else if (err.request) {
    e.status = 0;
    e.body = null;
  }
  return e;
}

// --- OBTENER TODAS LAS FRUTAS ---
export async function getFrutas() {
  try {
    console.log("[frutas.js] Llamando a GET frutas...");
    const resp = await axios.get(API_URL);
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (err) {
    console.error("[frutas.js] Error en getFrutas:", err);
    throw formatAxiosError(err);
  }
}

// --- OBTENER PROVEEDORES --- (extrae proveedores embebidos)
export async function getProveedores() {
  try {
    console.log("[frutas.js] Extrayendo proveedores desde getFrutas...");
    const frutas = await getFrutas();
    if (!Array.isArray(frutas) || frutas.length === 0) return [];

    const map = new Map();
    frutas.forEach((f) => {
      const p = f?.proveedor || f?.Proveedor || null;
      if (!p) return;
      const proveedor = {
        IdProveedor: p.IdProveedor ?? p.id ?? null,
        Nombre: p.Nombre ?? p.nombre ?? "",
        Direccion: p.Direccion ?? p.direccion ?? "",
        Telefono: p.Telefono ?? p.telefono ?? "",
        Email: p.Email ?? p.email ?? "",
        raw: p,
      };
      const key =
        proveedor.IdProveedor ??
        proveedor.Email ??
        proveedor.Nombre ??
        JSON.stringify(proveedor.raw);
      if (!map.has(key)) map.set(key, proveedor);
    });

    return Array.from(map.values()).map((p) => ({
      IdProveedor: p.IdProveedor,
      Nombre: p.Nombre,
      Direccion: p.Direccion,
      Telefono: p.Telefono,
      Email: p.Email,
      id: p.IdProveedor,
      nombre: p.Nombre,
      _raw: p.raw,
    }));
  } catch (err) {
    console.error("[frutas.js] Error en getProveedores:", err);
    throw err;
  }
}

// --- OBTENER FRUTA POR ID ---
export async function getFruta(id) {
  if (!id) throw new Error("ID de fruta requerido");
  const idNum = Number(id);
  try {
    console.log("[frutas.js] Llamando a getFruta:", idNum);
    const resp = await axios.get(`${API_URL}/${idNum}`);
    return resp.data;
  } catch (err) {
    console.error("[frutas.js] Error en getFruta:", err);
    throw formatAxiosError(err);
  }
}

// --- BUSCAR FRUTA POR TÉRMINO ---
export async function searchFruta(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") return [];
  try {
    console.log("[frutas.js] Llamando a searchFruta:", searchTerm);
    const resp = await axios.get(`${API_URL}/search`, { params: { searchTerm } });
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (err) {
    console.error("[frutas.js] Error en searchFruta:", err);
    throw formatAxiosError(err);
  }
}

// --- CREAR FRUTA ---
export async function createFruta(fruta = {}, proveedor = null) {
  try {
    console.log("[frutas.js] Llamando a createFruta:", { fruta, proveedor });
    const resp = await axios.post(API_URL, { Fruta: fruta, Proveedor: proveedor });
    return resp.data;
  } catch (err) {
    console.error("[frutas.js] Error en createFruta:", err);
    throw formatAxiosError(err);
  }
}

// --- ACTUALIZAR FRUTA ---
export async function updateFruta(id, fruta = {}, proveedor = null) {
  if (!id) throw new Error("ID de fruta requerido");
  const idNum = Number(id);
  try {
    console.log("[frutas.js] Llamando a updateFruta:", idNum, { fruta, proveedor });
    const resp = await axios.put(`${API_URL}/${idNum}`, { Fruta: fruta, Proveedor: proveedor });
    return resp.data;
  } catch (err) {
    console.error("[frutas.js] Error en updateFruta:", err);
    throw formatAxiosError(err);
  }
}

// --- ELIMINAR FRUTA ---
export async function deleteFruta(id) {
  if (!id) throw new Error("ID de fruta requerido");
  const idNum = Number(id);
  try {
    console.log("[frutas.js] Llamando a deleteFruta:", idNum);
    await axios.delete(`${API_URL}/${idNum}`);
    return true;
  } catch (err) {
    console.error("[frutas.js] Error en deleteFruta:", err);
    throw formatAxiosError(err);
  }
}
