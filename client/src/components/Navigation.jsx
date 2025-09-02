// Komponenta pro navigaci v aplikaci
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAboutInfo, setShowAboutInfo] = useState(false); // Stav pro zobrazení modálního okna

  // Načtení uživatelských dat z localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (role) {
      setUserRole(role);
      setUserName(name || 'Uživatel');
    }
  }, []);

  // Odhlášení uživatele
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setUserRole(null);
    setUserName('');
    window.location.href = '/login';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Otevření a zavření modálního okna "O aplikaci"
  const openAboutInfo = () => setShowAboutInfo(true);
  const closeAboutInfo = () => setShowAboutInfo(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3">
        <div className="container">
          {/* Logo / Brand */}
          <NavLink to="/" className="navbar-brand d-flex align-items-center" onClick={closeMenu}>
            <img src="/favicon.png" alt="Bohemia" height="30" />
          </NavLink>

          {/* Tlačítko pro mobilní menu */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            {userRole && (
              <ul className="navbar-nav me-auto">
                {/* O aplikaci */}
                <li className="nav-item">
                  <span
                    className="nav-link text-dark"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { openAboutInfo(); closeMenu(); }}
                  >
                    O aplikaci
                  </span>
                </li>

                {/* Pojištěný vidí jen své pojištění a profil */}
                {userRole === 'pojištěný' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/moje-pojisteni"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                        }
                        onClick={closeMenu}
                      >
                        Moje pojištění
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/muj-profil"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                        }
                        onClick={closeMenu}
                      >
                        Můj profil
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Administrátor vidí všechny záznamy */}
                {userRole === 'administrátor' && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/pojistenci"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                        }
                        onClick={closeMenu}
                      >
                        Pojištěnci
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/pojisteni"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                        }
                        onClick={closeMenu}
                      >
                        Pojištění
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/typ-pojisteni"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                        }
                        onClick={closeMenu}
                      >
                        Typy pojištění
                      </NavLink>
                    </li>
                    {/* Odkaz pro Pojišťovací události */}
                    <li className="nav-item">
                      <NavLink
                        to="/pojistne-udalosti"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                        }
                        onClick={closeMenu}
                      >
                        Pojišťovací události
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            )}

            {/* Pravá strana - přihlášení/odhlášení */}
            <ul className="navbar-nav ms-auto d-flex align-items-center">
              {userRole ? (
                <>
                  <li className="nav-item me-3 d-none d-md-block">
                    <span className="navbar-text">
                      <strong>{userName}</strong> <small>({userRole})</small>
                    </span>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="btn btn-outline-danger px-3 py-2 rounded-pill"
                      onClick={handleLogout}
                    >
                      Odhlásit
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `btn ${isActive ? "btn-primary" : "btn-outline-primary"} px-4 py-2 rounded-pill shadow-sm btn-hover`
                    }
                    onClick={closeMenu}
                  >
                    Přihlásit
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modální okno "O aplikaci" */}
      {showAboutInfo && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">O aplikaci Bohemia</h5>
                <button type="button" className="btn-close" onClick={closeAboutInfo}></button>
              </div>
              <div className="modal-body">
                <h6>Pojišťovací aplikace</h6>
                <p>
                  Aplikace Bohemia je moderní systém pro správu pojištěnců a pojištění. 
                  Umožňuje snadnou správu dat, přehledné vyhledávání a efektivní správu 
                  pojišťovacích produktů.
                </p>
                
                <h6>Hlavní funkce:</h6>
                <ul>
                  <li>Správa seznamu pojištěnců</li>
                  <li>Evidence pojištění</li>
                  <li>Přehled typů pojištění</li>
                  <li>Jednoduché vyhledávání a filtrování</li>
                  <li>Uživatelské role (pojištěný, administrátor)</li>
                </ul>

                <h6>Technologie:</h6>
                <p>React, Bootstrap, Moderní webové technologie</p>

                <h6>Verze: 1.0.0</h6>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeAboutInfo}>
                  Zavřít
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
