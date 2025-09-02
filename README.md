# Pojišťovna Bohemia

Yurii Zvirianskyi - Testovací projekt k rekvalifikačnímu kurzu "Tvorba www aplikací v JavaScript - ITNetwork.cz"  
Webová aplikace pro správu pojištěnců, pojištění a typů pojištění. Umožňuje kompletní evidenci pojištěných osob a jejich pojištění.

## Funkcionalita

### 📋 Základní funkce
- **Správa pojištěnců** - Kompletní CRUD operace (vytvoření, čtení, úprava, odstranění)
- **Správa pojištění** - Vytváření a správa pojistných smluv
- **Typy pojištění** - Správa kategorií pojištění (životní, majetkové, atd.)
- **Stránkování** - Podpora stránkování pro velké objemy dat

### 🎯 Hlavní vlastnosti
- **Responzivní design** - Plná funkčnost na desktopu i mobilních zařízeních
- **Intuitivní rozhraní** - Uživatelsky přívětivé ovládání
- **Validace formulářů** - Kontrola vstupních dat na straně klienta
- **Flash zprávy** - Zobrazení stavových hlášení pro uživatele

## 🛠️ Technologie

### Frontend
- **React 18** - Moderní knihovna pro uživatelská rozhraní
- **React Router v7** - Navigace mezi stránkami aplikace
- **Vite** - Vývojové prostředí a build tool
- **Bootstrap 5** - CSS framework pro responzivní design
- **Bootstrap Icons** - Knihovna ikon

### Backend
- **Node.js** - JavaScript runtime prostředí
- **Express.js 5** - Webový framework pro Node.js
- **SQLite** - Relační databázový systém
- **CORS** - Middleware pro cross-origin requests

## 📦 Instalace a spuštění

### Předpoklady
- Node.js (verze 16 nebo vyšší)
- npm nebo yarn

### Instalační kroky

1. **Naklonujte repozitář**

   git clone <url-repozitáře>
   cd pojistovna-bohemia
   Nainstalujte závislosti serveru


cd server
npm install
Nainstalujte závislosti klienta


cd client
npm install
Spusťte aplikaci

# Terminal 1 - Server (port 3001)
cd server
npm run dev

# Terminal 2 - Klient (port 5173)
cd client
npm run dev
Otevřete aplikaci

Frontend: http://localhost:5173

API: http://localhost:3001

🗄️ Databáze
Aplikace používá SQLite databázi



🚀 Build pro produkci
# Build klienta
cd client
npm run dev

# Spuštění serveru v produkčním režimu
cd server
node server.js


heslo pro administratora:
e-mail: admin@bohemia.cz
heslo: admin123

📞 Kontakt
Yurii Zvirianskyi
Kurz: Tvorba www aplikací v JavaScript - ITNetwork.cz

Tento projekt vznikl jako závěrečná práce rekvalifikačního kurzu a demonstruje kompletní vývoj full-stack webové aplikace v JavaScriptu.