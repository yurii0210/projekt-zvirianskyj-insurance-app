// Stránka pro zobrazení seznamu pojištění s možností mazání
import React, { useState, useEffect } from "react";
import { FlashMessage } from "../components/FlashMessage";
import Spinner from "../components/Spinner";
import { fetchInsurances, fetchInsuranceTypes } from "../utils/insuranceUtils";
import { apiDelete } from "../utils/api"; // pridal pro DELETE
import { useNavigate } from "react-router-dom";

function InsuranceList() {
  const navigate = useNavigate();
  const [insurances, setInsurances] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState("");
  const [insuredName, setInsuredName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [insuranceTypes, setInsuranceTypes] = useState([]);

  // Načtení typů pojištění
  const loadInsuranceTypes = async () => {
    try {
      const types = await fetchInsuranceTypes();
      setInsuranceTypes(types || []);
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se načíst typy pojištění.");
    }
  };

  // Inicializace typů při mountu
  useEffect(() => {
    loadInsuranceTypes();
  }, []);

  // Načtení pojištění
  const loadInsurances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchInsurances({ type, insuredName, page });
      setInsurances(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Nepodařilo se načíst pojištění.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsurances();
  }, [type, insuredName, page]);

  // Změna stránky
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  // Reset filtrů
  const handleResetFilters = () => {
    setType("");
    setInsuredName("");
    setPage(1);
  };

  // Přesměrování na editaci pojištění
  const handleEditClick = (insuranceId) => {
    if (insuranceId) navigate(`/upravit-pojisteni/${insuranceId}`);
  };

  // Smazání pojištění
  const handleDeleteClick = async (insuranceId) => {
    if (!insuranceId) return;
    if (!window.confirm("Opravdu chcete smazat toto pojištění?")) return;

    try {
      await apiDelete(`/insurances/${insuranceId}`);
      setInsurances((prev) => prev.filter((i) => i.id !== insuranceId));
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se smazat pojištění.");
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <FlashMessage message={error} type="danger" />}

      {/* Filtry */}
      <div className="mb-3">
        <div className="d-flex justify-content-between">
          <select
            className="form-select me-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Všechny typy</option>
            {insuranceTypes.map((insuranceType) => (
              <option key={insuranceType.id} value={insuranceType.id}>
                {insuranceType.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="form-control me-2"
            placeholder="Jméno pojištěnce"
            value={insuredName}
            onChange={(e) => setInsuredName(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tabulka */}
      {!isLoading && !error && (
        <>
          {insurances.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Typ pojištění</th>
                  <th>Pojistná částka</th>
                  <th>Pojištěnec</th>
                  <th>Předmět</th>
                  <th>Platnost od</th>
                  <th>Platnost do</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {insurances.map((insurance) => (
                  <tr key={insurance.id}>
                    <td>{insurance.typeName || "N/A"}</td>
                    <td>{insurance.amount ?? "N/A"} Kč</td>
                    <td>
                        {insurance.firstName && insurance.lastName? `${insurance.firstName} ${insurance.lastName}`
                        : "N/A"}
                    </td>
                    <td>{insurance.subject || "N/A"}</td>
                    <td>
                      {insurance.validFrom
                        ? new Date(insurance.validFrom).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {insurance.validTo
                        ? new Date(insurance.validTo).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteClick(insurance.id)}
                      >
                        Smazat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Žádná pojištění nejsou k dispozici.</p>
          )}
        </>
      )}

      {/* Paginace */}
      {!isLoading && !error && totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
              >
                Předchozí
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <li
                  key={`page-${pageNumber}`}
                  className={`page-item ${
                    pageNumber === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            )}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                Další
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default InsuranceList;
