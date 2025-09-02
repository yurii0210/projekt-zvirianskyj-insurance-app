// Soubor obsahuje funkce pro práci s pojištěním (načtení, přidání, úprava, odstranění)
import { apiGet, apiPost, apiPut, apiDelete } from "./api";

// ======================== Načtení seznamu pojištění ========================
export const fetchInsurances = async ({ type, insuredName, page = 1, limit = 10 } = {}) => {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (insuredName) params.append("insuredName", insuredName);
    params.append("page", page);
    params.append("limit", limit);

    // GET /api/insurances?type=...&insuredName=...&page=...&limit=...
    const data = await apiGet(`/insurances?${params.toString()}`);
    return data;
  } catch (error) {
    console.error("Chyba při načítání seznamu pojištění:", error);
    throw new Error("Nepodařilo se načíst seznam pojištění.");
  }
};

// ======================== Načtení typů pojištění ========================
export const fetchInsuranceTypes = async () => {
  try {
    // GET /api/insuranceTypes
    const data = await apiGet("/insuranceTypes");
    return data;
  } catch (error) {
    console.error("Chyba při načítání typů pojištění:", error);
    throw new Error("Nepodařilo se načíst typy pojištění.");
  }
};

// ======================== Přidání nového pojištění ========================
export const addInsurance = async (insuranceData) => {
  try {
    // POST /api/insurances
    const response = await apiPost("/insurances", insuranceData);
    return response;
  } catch (error) {
    console.error("Chyba při přidávání pojištění:", error);
    throw new Error("Nepodařilo se přidat pojištění.");
  }
};

// ======================== Aktualizace existujícího pojištění ========================
export const updateInsurance = async (insuranceId, updatedData) => {
  try {
    if (!insuranceId) throw new Error("Chybí ID pojištění pro aktualizaci.");
    // PUT /api/insurances/:id
    const response = await apiPut(`/insurances/${insuranceId}`, updatedData);
    return response;
  } catch (error) {
    console.error("Chyba při aktualizaci pojištění:", error);
    throw new Error("Nepodařilo se aktualizovat pojištění.");
  }
};

// ======================== Odstranění pojištění ========================
export const deleteInsurance = async (insuranceId) => {
  try {
    if (!insuranceId) throw new Error("Chybí ID pojištění pro odstranění.");
    // DELETE /api/insurances/:id
    const response = await apiDelete(`/insurances/${insuranceId}`);
    return response;
  } catch (error) {
    console.error("Chyba při odstraňování pojištění:", error);
    throw new Error("Nepodařilo se odstranit pojištění.");
  }
};
