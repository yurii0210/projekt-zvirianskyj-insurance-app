// Stránka pro přihlášení a registraci uživatelů
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'pojištěný' // Výchozí role
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
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Hesla se neshodují');
      return;
    }

    try {
      if (isLogin) {
        // Simulace přihlášení - v reálném případě by bylo volání API
        console.log('Přihlášení:', { email: formData.email, password: formData.password });
        
        // Simulace dat uživatele (v reálném případě z API odpovědi)
        const userData = {
          id: 1,
          name: 'Jan Novák',
          email: formData.email,
          role: formData.email.includes('admin') ? 'administrátor' : 'pojištěný'
        };
        
        // Uložení do localStorage
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userId', userData.id);
        
        // Přesměrování podle role
        if (userData.role === 'administrátor') {
          navigate('/pojistenci');
        } else {
          navigate('/moje-pojisteni');
        }
        
      } else {
        // Simulace registrace
        console.log('Registrace:', formData);
        
        // Uložení do localStorage
        localStorage.setItem('userRole', formData.role);
        localStorage.setItem('userName', formData.name);
        localStorage.setItem('userId', Date.now()); // Simulace ID
        
        alert('Registrace úspěšná! Nyní jste přihlášen.');
        setIsLogin(true);
        
        // Přesměrování podle role
        if (formData.role === 'administrátor') {
          navigate('/pojistenci');
        } else {
          navigate('/moje-pojisteni');
        }
      }
    } catch (error) {
      console.error('Chyba:', error);
      alert('Došlo k chybě. Zkuste to prosím znovu.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isLogin ? 'Přihlášení' : 'Registrace'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Jméno:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="pojištěný">Pojištěný</option>
                  <option value="administrátor">Administrátor</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              minLength="6"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Potvrdit heslo:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
          )}
          
          <button type="submit" className="auth-button">
            {isLogin ? 'Přihlásit se' : 'Registrovat se'}
          </button>
        </form>
        
        <p className="auth-toggle">
          {isLogin ? 'Ještě nemáte účet? ' : 'Už máte účet? '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Zaregistrovat se' : 'Přihlásit se'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;