// Stránka s formulářem pro přidání nebo úpravu pojištěnce včetně jeho pojištění
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import FlashMessage from "../components/FlashMessage";
import Spinner from "../components/Spinner";
import AddInsuranceForm from "../components/AddInsuranceForm";

function AddInsuredForm() {
  const { id } = useParams(); // Získání ID pojištěnce z URL
  const navigate = useNavigate();

  // Stav formuláře
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
    insurances: [], // Default prázdné pole pojištění
  });

  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddInsuranceForm, setShowAddInsuranceForm] = useState(false);

  // Načtení dat pojištěnce (jen pro editaci)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiGet(`insureds/${id}`)
        .then((data) => {
          // Přidání defaultního pole insurances, pokud server ho nevrátí
          setFormData({ ...data, insurances: data.insurances || [] });
          setIsLoading(false);
        })
        .catch(() => {
          setFlashMessage({
            message: "Nepodařilo se načíst data pojištěnce.",
            type: "danger",
          });
          setIsLoading(false);
        });
    }
  }, [id]);

  // Změna hodnot v inputech
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Odeslání formuláře (nový nebo aktualizace)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Aktualizace existujícího pojištěnce
        await apiPut(`insureds/${id}`, formData);
        setFlashMessage({
          message: "Změny byly úspěšně uloženy.",
          type: "success",
        });
      } else {
        // Vytvoření nového pojištěnce
        const createdInsured = await apiPost("insureds", formData);
        // Přesměrování na editaci nového pojištěnce
        navigate(`/upravit-pojistence/${createdInsured.id}`);
        setFlashMessage({
          message: "Nový pojištěnec byl úspěšně přidán.",
          type: "success",
        });
      }
    } catch (error) {
      setFlashMessage({
        message:
          error.response?.data?.message ||
          error.message ||
          "Chyba při ukládání dat.",
        type: "danger",
      });
    }
  };

  // Smazání konkrétního pojištění
  const handleDeleteInsurance = async (insuranceId) => {
    if (window.confirm("Opravdu chcete toto pojištění odstranit?")) {
      try {
        // Odebrání pojištění z lokálního stavu
        const updatedInsured = {
          ...formData,
          insurances: formData.insurances.filter(
            (ins) => ins.id !== insuranceId
          ),
        };
        setFormData(updatedInsured);

        // Smazání pojištění na serveru
        await apiDelete(`insurances/${insuranceId}`);

        // Načtení aktualizovaných dat pojištěnce
        const updatedData = await apiGet(`insureds/${id}`);
        setFormData({ ...updatedData, insurances: updatedData.insurances || [] });

        setFlashMessage({
          message: "Pojištění bylo úspěšně odstraněno.",
          type: "success",
        });
      } catch (error) {
        setFlashMessage({
          message: "Chyba při odstraňování pojištění.",
          type: "danger",
        });
      }
    }
  };

  // Smazání pojištěnce (pouze pokud nemá pojištění)
  const handleDeleteInsured = async () => {
    if ((formData.insurances || []).length > 0) {
      setFlashMessage({
        message: "Pojištěnec nemůže být smazán, protože má přiřazená pojištění.",
        type: "danger",
      });
      return;
    }

    if (window.confirm("Opravdu chcete tohoto pojištěnce smazat?")) {
      try {
        await apiDelete(`insureds/${id}`);
        setFlashMessage({
          message: "Pojištěnec byl úspěšně smazán.",
          type: "success",
        });
        navigate(-1);
      } catch (error) {
        setFlashMessage({
          message: "Chyba při mazání pojištěnce.",
          type: "danger",
        });
      }
    }
  };

  // Render komponenty
  return (
    <div className="container mt-4">
      <h6 className="mb-3">
        {id
          ? "Upravte údaje pojištěnce, spravujte jeho pojištění"
          : "Přidejte nového pojištěnce"}
      </h6>

      {/* Flash zprávy */}
      {flashMessage && (
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {/* Formulář pojištěnce */}
          <form onSubmit={handleSubmit}>
            {/* Jméno a příjmení */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  Jméno
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Příjmení
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Adresa a město */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="street" className="form-label">
                  Ulice
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label">
                  Město
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PSČ a email */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="postalCode" className="form-label">
                  PSČ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Telefon
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Tlačítka */}
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-outline-success">
                {id ? "Uložit změny" : "Přidat pojištěnce"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Zpět
              </button>
              {id && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDeleteInsured}
                >
                  Smazat pojištěnce
                </button>
              )}
            </div>
          </form>

          {/* Tabulka pojištění */}
          <h3 className="mt-4">Uzavřená pojištění</h3>
          {(formData.insurances || []).length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Typ pojištění</th>
                  <th>Pojistná částka</th>
                  <th>Předmět pojištění</th>
                  <th>Platnost od</th>
                  <th>Platnost do</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {formData.insurances.map((insurance) => (
                  <tr key={insurance.id}>
                    <td>{insurance.type?.name || "N/A"}</td>
                    <td>{insurance.amount} Kč</td>
                    <td>{insurance.subject}</td>
                    <td>{new Date(insurance.validFrom).toLocaleDateString()}</td>
                    <td>{new Date(insurance.validTo).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteInsurance(insurance.id)}
                      >
                        Odstranit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Žádné sjednané pojištění</p>
          )}

          {/* Přidání pojištění */}
          {id && !showAddInsuranceForm && (
            <button
              className="btn btn-outline-primary mt-4"
              onClick={() => setShowAddInsuranceForm(true)}
            >
              Pojistit
            </button>
          )}

          {id && showAddInsuranceForm && (
            <AddInsuranceForm
              insuredId={id}
              onInsuranceAdded={() => {
                setShowAddInsuranceForm(false);
                apiGet(`insureds/${id}`).then((updatedData) => {
                  setFormData({
                    ...updatedData,
                    insurances: updatedData.insurances || [],
                  });
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AddInsuredForm;
