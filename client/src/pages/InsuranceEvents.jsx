import React, { useState, useEffect } from "react";

function InsuranceEvents() {
  const [events, setEvents] = useState([]);
  const [insureds, setInsureds] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    insuredId: "",
    title: "",
    description: "",
    date: "",
    status: "Rozpracováno",
    payout: 0,
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // Stav pro zobrazení formuláře
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:3001/api";

  // Načtení pojištěnců a událostí při načtení stránky
  useEffect(() => {
    fetchInsureds();
    fetchEvents();
  }, []);

  const fetchInsureds = async () => {
    try {
      const res = await fetch(`${API_BASE}/insureds`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setInsureds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba při načítání pojištěnců:", err);
      setInsureds([]);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/events`);
      if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba při načítání událostí:", err);
      setError("Nepodařilo se načíst pojistné události. Zkontrolujte server.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Odeslání formuláře pro přidání nebo úpravu události
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, insuredId, title, description, date, status, payout } = formData;

    if (!insuredId || !title || !date) {
      alert("Vyplňte prosím všechny povinné údaje!");
      return;
    }

    const body = { insuredId, title, description, date, status, payout };

    try {
      if (isEditing) {
        await fetch(`${API_BASE}/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch(`${API_BASE}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      // Reset formuláře po úspěšném uložení
      setFormData({
        id: null,
        insuredId: "",
        title: "",
        description: "",
        date: "",
        status: "Rozpracováno",
        payout: 0,
      });
      setIsEditing(false);
      setIsFormVisible(false); // Skrytí formuláře
      fetchEvents();
    } catch (err) {
      console.error("Chyba při ukládání události:", err);
      alert("Nepodařilo se uložit událost. Zkontrolujte konzoli.");
    }
  };

  const handleAddClick = () => {
    // Reset formuláře před zobrazením
    setFormData({
      id: null,
      insuredId: "",
      title: "",
      description: "",
      date: "",
      status: "Rozpracováno",
      payout: 0,
    });
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Příprava formuláře pro úpravu existující události
  const handleEdit = (event) => {
    setFormData({
      id: event.id,
      insuredId: event.insuredId,
      title: event.title,
      description: event.description,
      date: event.date,
      status: event.status || "Rozpracováno",
      payout: event.payout || 0,
    });
    setIsEditing(true);
    setIsFormVisible(true); // Zobrazení formuláře
  };

  // Smazání události
  const handleDelete = async (id) => {
    if (window.confirm("Opravdu chcete smazat tuto událost?")) {
      try {
        await fetch(`${API_BASE}/events/${id}`, { method: "DELETE" });
        fetchEvents();
      } catch (err) {
        console.error("Chyba při mazání události:", err);
        alert("Nepodařilo se smazat událost.");
      }
    }
  };

  // Vrácení jména pojištěnce pro tabulku
  const getInsuredName = (event) => {
    const insured = insureds.find(ins => ins.id === event.insuredId);
    return insured ? `${insured.firstName} ${insured.lastName}` : "Neznámý pojištěnec";
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Načítání...</span>
        </div>
        <p className="mt-2">Načítání událostí...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5 text-center">
        <h4>Chyba při načítání dat</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchEvents}>
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pojistné události</h2>
        {!isFormVisible && (
          <button className="btn btn-primary" onClick={handleAddClick}>
            Přidat událost
          </button>
        )}
      </div>

      {/* Formulář pro přidání/úpravu události */}
      {isFormVisible && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{isEditing ? "Upravit událost" : "Nová událost"}</h5>
            <form onSubmit={handleSubmit}>
              {/* Výběr pojištěnce */}
              <div className="mb-3">
                <label className="form-label">Pojištěnec *</label>
                <select
                  className="form-select"
                  value={formData.insuredId}
                  onChange={(e) => setFormData({ ...formData, insuredId: e.target.value })}
                  required
                >
                  <option value="">Vyberte pojištěnce</option>
                  {insureds.map((ins) => (
                    <option key={ins.id} value={ins.id}>
                      {ins.firstName} {ins.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Název události */}
              <div className="mb-3">
                <label className="form-label">Název události *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Popis */}
              <div className="mb-3">
                <label className="form-label">Popis</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Datum */}
              <div className="mb-3">
                <label className="form-label">Datum *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* Stav události */}
              <div className="mb-3">
                <label className="form-label">Stav události</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Rozpracováno">Rozpracováno</option>
                  <option value="V řešení">V řešení</option>
                  <option value="Vyplaceno">Vyplaceno</option>
                </select>
              </div>

              {/* Vyplacená částka */}
              <div className="mb-3">
                <label className="form-label">Vyplacená částka</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.payout || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, payout: e.target.value ? parseFloat(e.target.value) : 0 })
                  }
                  min="0"
                  step="0.01"
                />
              </div>

              <button type="submit" className="btn btn-primary">{isEditing ? "Upravit" : "Přidat"}</button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setFormData({ id: null, insuredId: "", title: "", description: "", date: "", status: "Rozpracováno", payout: 0 });
                  setIsEditing(false);
                  setIsFormVisible(false); // Skrytí formuláře při zrušení
                }}
              >
                Zrušit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Seznam událostí */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Pojištěnec</th>
              <th>Název</th>
              <th>Popis</th>
              <th>Datum</th>
              <th>Stav</th>
              <th>Vyplaceno</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? events.map((event, idx) => (
              <tr key={event.id || idx}>
                <td>{idx + 1}</td>
                <td>{getInsuredName(event)}</td>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{event.date}</td>
                <td>{event.status}</td>
                <td>{event.payout}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(event)}>Upravit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event.id)}>Smazat</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center">Žádné události k zobrazení</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsuranceEvents;
