import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

// Komponenta pro flash zprávy
const FlashZprava = ({ zprava, typ }) => (
    <div className={`p-4 rounded shadow mb-4 text-white alert alert-${typ === 'danger' ? 'danger' : 'success'}`}>
        {zprava}
    </div>
);

// Komponenta pro zobrazení spinneru
const Nacitani = () => (
    <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Načítání...</span>
        </div>
    </div>
);

export default function Aplikace() {
    // ======================== STAVY ========================
    const [typyPojisteni, setTypyPojisteni] = useState([]);
    const [nacitani, setNacitani] = useState(true);
    const [flashZprava, setFlashZprava] = useState(null);
    const [upravenyPrvek, setUpravenyPrvek] = useState(null);
    const [formularNazev, setFormularNazev] = useState('');
    const [mazani, setMazani] = useState(false);
    const [mazanyId, setMazanyId] = useState(null);

    // ======================== FUNKCE ========================

    // Načtení typů pojištění včetně počtu pojištění
    const nactiTypyPojisteni = async () => {
        setNacitani(true);
        setFlashZprava(null);
        try {
            const data = await apiGet("insuranceTypes"); // endpoint vrací už pocetPojisteni
            setTypyPojisteni(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setFlashZprava({ zprava: "Nepodařilo se načíst data.", typ: "danger" });
        } finally {
            setNacitani(false);
        }
    };

    // načtení dat při startu komponenty
    useEffect(() => {
        nactiTypyPojisteni();
    }, []);

    // Přidání nového typu
    const pridejNovy = () => {
        setUpravenyPrvek({});
        setFormularNazev('');
    };

    // Upravení existujícího typu
    const upravPrvek = (item) => {
        setUpravenyPrvek(item);
        setFormularNazev(item.name);
    };

    // Zrušení úprav
    const zrusitUpravy = () => {
        setUpravenyPrvek(null);
        setFormularNazev('');
    };

    // Odeslání formuláře pro přidání/úpravu
    const odesliFormular = async (e) => {
        e.preventDefault();
        setFlashZprava(null);

        if (!formularNazev.trim()) {
            setFlashZprava({ zprava: "Název nesmí být prázdný.", typ: "danger" });
            return;
        }

        try {
            const dataKUlozeni = { name: formularNazev.trim() };
            if (upravenyPrvek && upravenyPrvek.id) {
                await apiPut("insuranceTypes", upravenyPrvek.id, dataKUlozeni);
                setFlashZprava({ zprava: "Typ pojištění byl úspěšně aktualizován.", typ: "success" });
            } else {
                await apiPost("insuranceTypes", dataKUlozeni);
                setFlashZprava({ zprava: "Nový typ pojištění byl úspěšně přidán.", typ: "success" });
            }
            zrusitUpravy();
            nactiTypyPojisteni(); // znovu načíst data, aby se aktualizoval počet pojištění
        } catch (err) {
            setFlashZprava({ zprava: err.message || "Došlo k chybě při ukládání dat.", typ: "danger" });
        }
    };

    // Mazání typu pojištění
    const klikNaSmazani = (id) => {
        setMazanyId(id);
        setMazani(true);
    };

    const potvrditSmazani = async () => {
        setMazani(false);
        setFlashZprava(null);
        try {
            await apiDelete("insuranceTypes", mazanyId);
            setFlashZprava({ zprava: "Typ pojištění byl úspěšně smazán.", typ: "success" });
            nactiTypyPojisteni();
        } catch (err) {
            setFlashZprava({ zprava: err.message || "Došlo k chybě při mazání.", typ: "danger" });
        }
    };

    // ======================== RENDER ========================
    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="container p-5 bg-white rounded-3 shadow">
                {/* Nadpis a tlačítko přidání */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h2 fw-bold text-dark">Správa typů pojištění</h2>
                    {!upravenyPrvek && (
                        <button onClick={pridejNovy} className="btn btn-primary rounded-pill shadow-sm">
                            + Přidat nový
                        </button>
                    )}
                </div>

                {/* Flash zprávy */}
                {flashZprava && <FlashZprava zprava={flashZprava.zprava} typ={flashZprava.typ} />}
                {nacitani && <Nacitani />}

                {/* Formulář pro přidání/úpravu */}
                {upravenyPrvek && (
                    <div className="mt-4 p-4 bg-light rounded-3 shadow-inner">
                        <h3 className="h5 fw-semibold mb-3">
                            {upravenyPrvek.id ? "Upravit typ pojištění" : "Přidat nový typ pojištění"}
                        </h3>
                        <form onSubmit={odesliFormular} className="d-flex flex-column flex-md-row gap-3">
                            <input
                                type="text"
                                value={formularNazev}
                                onChange={(e) => setFormularNazev(e.target.value)}
                                placeholder="Název typu pojištění"
                                className="form-control flex-grow-1 rounded-3"
                                required
                            />
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success rounded-pill shadow-sm">Uložit</button>
                                <button type="button" onClick={zrusitUpravy} className="btn btn-secondary rounded-pill shadow-sm">Zrušit</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabulka typů pojištění */}
                {!nacitani && !upravenyPrvek && (
                    <div className="mt-4">
                        {typyPojisteni.length > 0 ? (
                            <table className="table table-striped table-hover rounded-3 overflow-hidden shadow-sm">
                                <thead>
                                    <tr>
                                        <th>Název</th>
                                        <th>Počet pojištění</th>
                                        <th className="text-end">Akce</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {typyPojisteni.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            {/* Zobrazení počtu pojištění */}
                                            <td>{item.pocetPojisteni}</td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button onClick={() => upravPrvek(item)} className="btn btn-info btn-sm rounded-pill text-white">Upravit</button>
                                                    <button onClick={() => klikNaSmazani(item.id)} className="btn btn-danger btn-sm rounded-pill">Smazat</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-muted mt-4">Žádné dostupné typy pojištění. Přidejte první!</p>
                        )}
                    </div>
                )}

                {/* Modal pro potvrzení mazání */}
                {mazani && (
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Potvrdit smazání</h5>
                                </div>
                                <div className="modal-body">
                                    <p>Opravdu chcete smazat tento typ pojištění? Tuto akci nelze vrátit zpět.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setMazani(false)}>Zrušit</button>
                                    <button type="button" className="btn btn-danger rounded-pill" onClick={potvrditSmazani}>Ano, smazat</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
