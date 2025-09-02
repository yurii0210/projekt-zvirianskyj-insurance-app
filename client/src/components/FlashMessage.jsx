// Komponenta pro zobrazení flash zprávy ve stránkách


//type = "success" nebo "danger" atd. - podle bootstrap
//message = zpráva, kterou chceme zobrazit
import React from "react";
export function FlashMessage({ message, type }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
}

export default FlashMessage;