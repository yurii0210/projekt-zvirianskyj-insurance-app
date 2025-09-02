// Stránka pro zobrazení a úpravu profilu uživatele
import React, { useState, useEffect } from 'react';

const MyProfil = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    // Načtení dat uživatele - simulace
    setUserData({
      name: 'Jan Novák',
      email: 'jan.novak@email.cz',
      address: 'Pražská 123, Praha',
      phone: '+420 123 456 789'
    });
  }, []);

  return (
    <div className="container mt-4">
      <h1>Můj profil</h1>
      
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Osobní údaje</h5>
          <p><strong>Jméno:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Adresa:</strong> {userData.address}</p>
          <p><strong>Telefon:</strong> {userData.phone}</p>
          
          <button className="btn btn-primary">
            Upravit profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfil;