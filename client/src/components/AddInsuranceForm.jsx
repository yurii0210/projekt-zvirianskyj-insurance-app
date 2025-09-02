// Komponenta formuláře pro přidání pojištění
import React, { useState, useEffect } from "react";
import { apiPost, apiGet } from "../utils/api"; // Funkce pro volání API
import FlashMessage from "../components/FlashMessage"; // Komponenta pro flash zprávy

function AddInsuranceForm({ insuredId, onInsuranceAdded }) {
  // Stav formuláře
  const [formData, setFormData] = useState({
    typeId: "",       // POZOR: server očekává typeId, ne type
    amount: "",
    subject: "",
    validFrom: "",
    validTo: "",
  });

  const [insuranceTypes, setInsuranceTypes] = useState([]); // Seznam typů pojištění
  const [isLoading, setIsLoading] = useState(true);         // Spinner při načítání
  const [error, setError] = useState(null);                 // Chyby při načítání
  const [flashMessage, setFlashMessage] = useState(null);   // Flash zprávy

  // Načtení typů pojištění při mountu komponenty
  useEffect(() => {
    const loadInsuranceTypes = async () => {
      try {
        const data = await apiGet("insuranceTypes"); // GET typů pojištění
        setInsuranceTypes(data);
        setIsLoading(false);
      } catch {
        setError("Nepodařilo se načíst typy pojištění.");
        setIsLoading(false);
      }
    };
    loadInsuranceTypes();
  }, []);

  // Funkce pro změnu hodnot ve formuláři
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funkce pro odeslání formuláře
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Připrava objektu pro API (včetně typeId)
      const newInsurance = { ...formData, insuredId };
      await apiPost("insurances", newInsurance); // POST požadavek
      setFlashMessage({ message: "Pojištění bylo úspěšně přidáno.", type: "success" });

      // Reset formuláře
      setFormData({ typeId: "", amount: "", subject: "", validFrom: "", validTo: "" });

      // Callback pro aktualizaci seznamu pojištění
      onInsuranceAdded();
    } catch {
      setFlashMessage({ message: "Nepodařilo se přidat pojištění.", type: "danger" });
    }
  };

  // Render komponenty
  return (
    <div className="mt-4">
      <h4>Přidat pojištění</h4>

      {/* Flash zprávy */}
      {flashMessage && <FlashMessage message={flashMessage.message} type={flashMessage.type} />}
      {isLoading && <p>Načítám typy pojištění...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!isLoading && !error && (
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="typeId" className="form-label">Typ pojištění</label>
              <select
                className="form-select"
                id="typeId"
                name="typeId"
                value={formData.typeId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Vyberte typ pojištění</option>
                {insuranceTypes.map((type) => (
                  <option key={type.id || type._id} value={type.id || type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="amount" className="form-label">Pojistná částka</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="subject" className="form-label">Předmět pojištění</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="validFrom" className="form-label">Platnost od</label>
              <input
                type="date"
                className="form-control"
                id="validFrom"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="validTo" className="form-label">Platnost do</label>
              <input
                type="date"
                className="form-control"
                id="validTo"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-outline-primary">Přidat pojištění</button>
        </form>
      )}
    </div>
  );
}

export default AddInsuranceForm;
