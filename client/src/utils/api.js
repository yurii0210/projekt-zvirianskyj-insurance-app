// Standardní funkce pro komunikaci s backendovým API

// Základní URL pro API
export const API_URL = "http://localhost:3001/api";

/**
 * Hlavní funkce pro všechny požadavky na API
 * @param {string} endpoint - cesta ke zdroji, např. "/insureds"
 * @param {object} options - parametry pro fetch
 */
async function request(endpoint, options = {}) {
  try {
    // Přidá / na začátek endpointu, pokud chybí
    const url = endpoint.startsWith("/") ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;

    console.log(`🔹 API Request: ${options.method || "GET"} ${url}`); // Logování požadavku

    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");

    // Zpracování JSON odpovědi
    const data = contentType && contentType.includes("application/json")
      ? await response.json()
      : null;

    // Pokud odpověď není OK, vyhodí chybu
    if (!response.ok) {
      const errorMessage = data?.message || `Chyba na ${endpoint}: ${response.statusText}`;
      console.error(`❌ API Chyba: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    console.log(`✅ API Response: ${url}`, data); // Logování úspěšné odpovědi
    return data;
  } catch (error) {
    console.error(`❌ Chyba při požadavku na ${endpoint}:`, error.message);
    throw error;
  }
}

// GET - získání dat
export const apiGet = (endpoint) => request(endpoint);

// POST - vytvoření nového záznamu
export const apiPost = (endpoint, body) =>
  request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// PUT - aktualizace existujícího záznamu
export const apiPut = (endpoint, body) =>
  request(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// DELETE - smazání záznamu
export const apiDelete = (endpoint, id) =>
  request(`${endpoint}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });