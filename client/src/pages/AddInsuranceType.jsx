// Stránka pro přidání nebo úpravu typu pojištění

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api"; // Funkce pro práci s API
import FlashMessage from "../components/FlashMessage"; // Komponenta pro zobrazení flash zprávy
import Spinner from "../components/Spinner"; // Komponenta pro zobrazení spinneru

function AddInsuranceType() {
  const { id } = useParams(); // ID typu pojištění z URL
  const [formData, setFormData] = useState({ name: "" }); // Stav formuláře pro název pojištění
  const [flashMessage, setFlashMessage] = useState(null); // Stav pro flash zprávu
  const [isLoading, setIsLoading] = useState(false); // Stav pro načítání dat
  const navigate = useNavigate(); // Funkce pro přesměrování uživatele

  // Načtení existujícího typu pojištění při úpravě
  useEffect(() => {
    if (id) {
      setIsLoading(true); // Aktivace spinneru
      apiGet(`insuranceTypes/${id}`)
        .then((data) => {
          setFormData(data); // Naplnění formuláře daty z API
          setIsLoading(false);
        })
        .catch(() => {
          setFlashMessage({
            message: "Nepodařilo se načíst data typu pojištění.",
            type: "danger",
          });
          setIsLoading(false);
        });
    }
  }, [id]);

  // Funkce pro změnu hodnot formuláře
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funkce pro odeslání formuláře (POST nebo PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Aktivace spinneru
    try {
      if (id) {
        // Aktualizace existujícího typu pojištění
        await apiPut(`insuranceTypes/${id}`, formData);
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        // Přidání nového typu pojištění
        await apiPost("insuranceTypes", formData);
        setFlashMessage({
          message: "Nový typ pojištění byl úspěšně přidán.",
          type: "success",
        });
        setFormData({ name: "" }); // Vyčištění formuláře
      }
    } catch {
      setFlashMessage({
        message: "Chyba při ukládání dat.",
        type: "danger",
      });
    } finally {
      setIsLoading(false); // Deaktivace spinneru
    }
  };

  // Funkce pro smazání typu pojištění
  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("Opravdu chcete smazat tento typ pojištění?");
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await apiDelete(`insuranceTypes/${id}`);
      setFlashMessage({
        message: "Typ pojištění byl úspěšně smazán.",
        type: "success",
      });
      navigate("/typ-pojisteni"); // Přesměrování na seznam typů pojištění
    } catch (error) {
      const errorMessage = error.message || "Chyba při mazání typu pojištění.";
      setFlashMessage({ message: errorMessage, type: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  // Funkce pro návrat zpět na seznam typů pojištění
  const handleBack = () => {
    navigate("/typ-pojisteni");
  };

  // Vykreslení komponenty
  return (
    <div className="container mt-4">
      <h2 className="mb-3">
        {id ? "Upravit typ pojištění" : "Přidat nový typ pojištění"}
      </h2>

      {/* Zobrazení flash zprávy */}
      {flashMessage && <FlashMessage message={flashMessage.message} type={flashMessage.type} />}

      {/* Spinner při načítání */}
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Pole pro název typu pojištění */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Název pojištění
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tlačítka pro odeslání a další akce */}
          <div className="d-flex gap-3">
            <button type="submit" className="btn btn-outline-success">
              {id ? "Uložit změny" : "Přidat pojištění"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
              Zpět
            </button>
            {id && (
              <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
                Smazat
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default AddInsuranceType;
