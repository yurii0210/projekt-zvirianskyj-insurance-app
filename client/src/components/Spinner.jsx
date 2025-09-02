// Komponenta Spinner
import React from "react";

// Komponenta pro zobrazení načítání dat (spinner) podle Bootstrapu
const Spinner = () => {
  return (
    <div className="d-flex justify-content-center my-4">
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Načítání...</span>
      </div>
    </div>
  );
};

export default Spinner;
