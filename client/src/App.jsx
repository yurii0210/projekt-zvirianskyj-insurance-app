// Hlavní komponenta aplikace Pojišťovna Bohemia
// Zajišťuje nastavení routeru, definici tras a základní strukturu stránky.

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import InsuredList from "./pages/InsuredList";
import InsuranceList from "./pages/InsuranceList";
import InsuranceType from "./pages/InsuranceType";
import AddInsuredForm from "./pages/AddInsuredForm";
import AddInsuranceType from "./pages/AddInsuranceType";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import MyInsurance from "./pages/MyInsurance";
import MyProfil from "./pages/MyProfil";
import AdminLogin from "./pages/AdminLogin";
import InsuranceEvents from "./pages/InsuranceEvents";

import "./App.css";

// Pomocná komponenta pro jednotné zobrazení stránek s nadpisem
const PageWithTitle = ({ title, children }) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Stránka pro přihlášení/registraci - bez Layoutu */}
        <Route path="/login" element={<AuthPage />} />

        {/* Stránka pro administrátorské přihlášení - bez Layoutu */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Ostatní stránky s Layout komponentou */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                {/* Přesměrování na výchozí stránku podle role uživatele */}
                <Route path="/" element={<Navigate to="/pojistenci" />} />

                {/* Stránky pro administrátory */}
                <Route
                  path="/pojistenci"
                  element={
                    <PageWithTitle title="Seznam pojištěnců">
                      <InsuredList />
                    </PageWithTitle>
                  }
                />
                <Route
                  path="/pridat-pojistence"
                  element={
                    <PageWithTitle title="Přidat pojištěnce">
                      <AddInsuredForm />
                    </PageWithTitle>
                  }
                />
                <Route
                  path="/upravit-pojistence/:id"
                  element={
                    <PageWithTitle title="Upravit pojištěnce">
                      <AddInsuredForm />
                    </PageWithTitle>
                  }
                />

                <Route
                  path="/pojisteni"
                  element={
                    <PageWithTitle title="Seznam pojištění">
                      <InsuranceList />
                    </PageWithTitle>
                  }
                />

                <Route
                  path="/typ-pojisteni"
                  element={
                    <PageWithTitle title="Typy pojištění">
                      <InsuranceType />
                    </PageWithTitle>
                  }
                />
                <Route
                  path="/pridat-typ-pojisteni"
                  element={
                    <PageWithTitle title="Přidat typ pojištění">
                      <AddInsuranceType />
                    </PageWithTitle>
                  }
                />
                <Route
                  path="/upravit-typ-pojisteni/:id"
                  element={
                    <PageWithTitle title="Upravit typ pojištění">
                      <AddInsuranceType />
                    </PageWithTitle>
                  }
                />

                {/* Stránka pro správu pojistných událostí */}
                <Route
                  path="/pojistne-udalosti"
                  element={
                    <PageWithTitle title="Pojistné události">
                      <InsuranceEvents />
                    </PageWithTitle>
                  }
                />

                {/* Stránky pro pojištěné */}
                <Route
                  path="/moje-pojisteni"
                  element={
                    <PageWithTitle title="Moje pojištění">
                      <MyInsurance />
                    </PageWithTitle>
                  }
                />
                <Route
                  path="/muj-profil"
                  element={
                    <PageWithTitle title="Můj profil">
                      <MyProfil />
                    </PageWithTitle>
                  }
                />

                {/* Stránka 404 */}
                <Route
                  path="*"
                  element={
                    <PageWithTitle title="404 - Stránka nenalezena">
                      <p>Požadovaná stránka nebyla nalezena.</p>
                    </PageWithTitle>
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
