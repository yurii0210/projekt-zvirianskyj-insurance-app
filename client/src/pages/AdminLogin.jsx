//Stránka pro přihlášení administrátora
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kontrola administrátorského kódu
    if (formData.adminCode !== 'admin123') { // Jednoduchý kód pro demo
      alert('Neplatný administrátorský kód');
      return;
    }

    try {
      // Simulace přihlášení admina
      const userData = {
        id: 1,
        name: 'Administrátor',
        email: formData.email,
        role: 'administrátor'
      };
      
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userId', userData.id);
      
      navigate('/pojistenci');
    } catch (error) {
      console.error('Chyba:', error);
      alert('Došlo k chybě. Zkuste to prosím znovu.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Administrátorské přihlášení</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@bohemia.cz"
            />
          </div>
          
          <div className="form-group">
            <label>Heslo:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Administrátorský kód:</label>
            <input
              type="password"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              required
              placeholder="Zadejte bezpečnostní kód"
            />
          </div>
          
          <button type="submit" className="auth-button">
            Přihlásit se jako administrátor
          </button>
        </form>
        
        <p className="auth-toggle">
          <span onClick={() => navigate('/login')}>
            ← Zpět na běžné přihlášení
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;