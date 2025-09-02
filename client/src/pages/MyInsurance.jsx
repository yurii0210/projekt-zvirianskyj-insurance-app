// Stránka pro zobrazení přehledu pojištění přihlášeného uživatele
import React, { useState, useEffect } from 'react';

const MyInsurance = () => {
  const [userInsurance, setUserInsurance] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
    
    // Načtení pojištění pouze pro přihlášeného uživatele
    // Simulace dat
    setUserInsurance([
      { id: 1, type: 'Životní pojištění', amount: '500 000 Kč' },
      { id: 2, type: 'Pojištění domácnosti', amount: '2 000 000 Kč' }
    ]);
  }, []);

  return (
    <div className="container mt-4">
      <h1>Moje pojištění</h1>
      <p>Zde vidíte přehled všech svých pojištění.</p>
      
      <div className="row">
        {userInsurance.map(insurance => (
          <div key={insurance.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{insurance.type}</h5>
                <p className="card-text">Částka: {insurance.amount}</p>
                <button className="btn btn-outline-primary btn-sm">
                  Detail pojištění
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyInsurance;