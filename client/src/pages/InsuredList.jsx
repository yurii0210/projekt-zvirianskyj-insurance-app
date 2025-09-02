// Stránka pro zobrazení seznamu pojištěnců s možností filtrování, mazání a zobrazení detailů
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import Spinner from "../components/Spinner";
import { apiGet, apiDelete } from "../utils/api";

function InsuredList() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    insureds: [],
    selectedInsuredId: null, // Stav pro sledování rozbalené karty
    isLoading: true,
    error: null,
  });
  const [filters, setFilters] = useState({ firstName: "", lastName: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /**
   * Načítá seznam pojištěnců z API.
   * Aktualizuje stav načítání a chyb.
   */
  const loadInsureds = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await apiGet(`insureds?${params}`);
      setState(prev => ({
        ...prev,
        insureds: Array.isArray(data) ? data : [],
      }));
      setCurrentPage(1);
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: "Nepodařilo se načíst pojištěnce.",
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Využívá useEffect pro načtení dat při změně filtrů
  useEffect(() => {
    loadInsureds();
  }, [filters]);

  /**
   * Zpracovává změny hodnot ve vstupních polích pro filtrování.
   */
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Vynuluje filtry do počátečního stavu.
   */
  const handleResetFilters = () => {
    setFilters({ firstName: "", lastName: "" });
  };

  /**
   * Odstraní pojištěnce po potvrzení uživatelem.
   * Po úspěšném smazání znovu načte seznam.
   */
  const handleDelete = async id => {
    if (!window.confirm("Opravdu chcete smazat pojištěnce?")) return;
    try {
      await apiDelete(`insureds/${id}`);
      loadInsureds();
    } catch (err) {
      setState(prev => ({ ...prev, error: "Nepodařilo se smazat pojištěnce." }));
    }
  };

  /**
   * Přepíná viditelnost karty s podrobnými informacemi.
   */
  const toggleCard = id => {
    setState(prev => ({
      ...prev,
      selectedInsuredId: prev.selectedInsuredId === id ? null : id,
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInsureds = state.insureds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(state.insureds.length / itemsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Pojištěnci</h4>
        <Link className="btn btn-primary" to="/pridat-pojistence">
          Nový pojištěnec
        </Link>
      </div>

      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Jméno"
          name="firstName"
          value={filters.firstName}
          onChange={handleFilterChange}
          className="form-control"
        />
        <input
          type="text"
          placeholder="Příjmení"
          name="lastName"
          value={filters.lastName}
          onChange={handleFilterChange}
          className="form-control"
        />
        <button className="btn btn-secondary" onClick={handleResetFilters}>
          Reset
        </button>
      </div>

      {state.isLoading && <Spinner />}
      {state.error && <FlashMessage message={state.error} type="danger" />}

      {!state.isLoading && !state.error && (
        <>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Jméno</th>
                <th>Bydliště</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentInsureds.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">Žádní pojištěnci nenalezeni.</td>
                </tr>
              ) : (
                currentInsureds.map(insured => (
                  <React.Fragment key={insured.id}>
                    <tr>
                      <td
                        onClick={() => toggleCard(insured.id)}
                        style={{ cursor: "pointer", color: "#0d6efd", textDecoration: "underline" }}
                      >
                        {insured.firstName} {insured.lastName}
                      </td>
                      <td>
                        {insured.street}, {insured.city}
                      </td>
                      <td className="text-center">
                         <button
                           className="btn btn-sm btn-danger"
                           onClick={() => handleDelete(insured.id)}
                         >
                           Smazat
                         </button>
                      </td>
                      <td className="text-center">
                         <button
                           className="btn btn-sm btn-warning"
                           onClick={() => navigate(`/upravit-pojistence/${insured.id}`)}
                         >
                           Upravit
                         </button>
                       </td>
                    </tr>
                    {state.selectedInsuredId === insured.id && (
                      <tr className="table-light">
                        <td colSpan="4">
                          <div className="card-body">
                            <p><strong>Email:</strong> {insured.email}</p>
                            <p><strong>Telefon:</strong> {insured.phone}</p>
                            <p><strong>PSČ:</strong> {insured.postalCode}</p>
                            {insured.insurances && insured.insurances.length > 0 && (
                              <>
                                <h6>Pojištění:</h6>
                                <ul>
                                  {insured.insurances.map(ins => (
                                    <li key={ins.id}>
                                      {ins.type?.name || "N/A"} - {ins.subject} - {ins.amount} Kč
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    Předchozí
                  </button>
                </li>
                {[...Array(totalPages).keys()].map(number => (
                  <li key={number + 1} className={`page-item ${currentPage === number + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => paginate(number + 1)}>
                      {number + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    Další
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default InsuredList;