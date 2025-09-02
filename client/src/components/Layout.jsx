/**
 * === KOMPONENTA LAYOUT ===
 * Slouží jako základní šablona celé aplikace.
 * Obsahuje hlavičku, navigaci, hlavní obsah a patičku.
 * @param {ReactNode} children - Obsah stránky, který se vloží do hlavního kontejneru
 */

import React from "react";
import Navigation from "./Navigation";

export default function Layout({ children }) {
  return (
    <div className="app-container d-flex flex-column min-vh-100"> {/* Bootstrap klassy pro sticky footer */}
      {/* --- HLAVIČKA --- */}
      <header className="page-header bg-light py-3">
        <div className="container">
          <div className="d-flex align-items-center">
            <img 
              src="/favicon.png" 
              alt="Logo Pojišťovna Bohemia" 
              className="header-logo me-3" 
              style={{height: "50px"}} 
            />
            <h1 className="mb-0">Pojišťovna Bohemia</h1>
          </div>
        </div>
      </header>

      {/* --- NAVIGACE --- */}
      <Navigation />

      {/* --- HLAVNÍ OBSAH --- */}
      <main className="content-wrapper flex-grow-1 py-4"> {/* flex-grow-1 pro sticky footer */}
        <div className="container">
          {children}
        </div>
      </main>

      {/* --- PATIČKA --- */}
      <footer className="footer bg-dark text-light py-3 mt-auto"> {/* mt-auto pro sticky footer */}
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">&copy; 2025 Pojišťovna Bohemia &amp; Yurii Zvirianskyi</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a 
                href="https://www.linkedin.com/in/yurii-zvirianskyi-37a88433b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light text-decoration-none"
                title="Navštivte můj LinkedIn"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}