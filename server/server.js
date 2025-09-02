// server.js
// ======================== IMPORTY ========================
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ======================== INICIALIZACE ========================
const app = express();
const PORT = 3001;

// ======================== MIDDLEWARE ========================
app.use(express.json());
app.use(cors());

// ======================== INICIALIZACE DB ========================
const dbPath = path.join(__dirname, "insuranceDB.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Chyba připojení k SQLite:", err.message);
  else console.log("✅ Připojeno k SQLite");
});

// ======================== TABULKY ========================
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS insureds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    postalCode TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS insuranceTypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS insurances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    typeId INTEGER NOT NULL,
    amount REAL NOT NULL,
    insuredId INTEGER NOT NULL,
    subject TEXT NOT NULL,
    validFrom TEXT NOT NULL,
    validTo TEXT NOT NULL,
    FOREIGN KEY(typeId) REFERENCES insuranceTypes(id),
    FOREIGN KEY(insuredId) REFERENCES insureds(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    insuredId INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'Rozpracováno',
    payout REAL DEFAULT 0,
    FOREIGN KEY(insuredId) REFERENCES insureds(id)
  )`);
});

// ======================== FUNKCE ========================
function handleDatabaseError(err, res, customMessage = "Database error") {
  console.error("❌ Database error:", err.message);
  return res.status(500).json({ message: customMessage, error: err.message });
}

// ======================== ENDPOINTY ========================

// --------- INSUREDS ----------
app.get("/api/insureds", (req, res) => {
  db.all("SELECT * FROM insureds ORDER BY id DESC", [], (err, rows) => {
    if (err) return handleDatabaseError(err, res, "Chyba při načítání pojištěnců");
    res.json(rows || []);
  });
});

app.get("/api/insureds/:id", (req, res) => {
  db.get("SELECT * FROM insureds WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return handleDatabaseError(err, res, "Chyba při načítání pojištěnce");
    if (!row) return res.status(404).json({ message: "Pojištěnec nenalezen" });
    res.json(row);
  });
});

app.post("/api/insureds", (req, res) => {
  const { firstName, lastName, street, city, postalCode, email, phone } = req.body;
  const sql = `INSERT INTO insureds (firstName, lastName, street, city, postalCode, email, phone)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [firstName, lastName, street, city, postalCode, email, phone], function (err) {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

app.put("/api/insureds/:id", (req, res) => {
  const { firstName, lastName, street, city, postalCode, email, phone } = req.body;
  const sql = `UPDATE insureds SET firstName=?, lastName=?, street=?, city=?, postalCode=?, email=?, phone=? WHERE id=?`;
  db.run(sql, [firstName, lastName, street, city, postalCode, email, phone, req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při aktualizaci pojištěnce");
    if (this.changes === 0) return res.status(404).json({ message: "Pojištěnec nenalezen" });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete("/api/insureds/:id", (req, res) => {
  db.run("DELETE FROM insurances WHERE insuredId = ?", [req.params.id], (err) => {
    if (err) return handleDatabaseError(err, res, "Chyba při mazání pojištění pojištěnce");
    db.run("DELETE FROM insureds WHERE id = ?", [req.params.id], function(err) {
      if (err) return handleDatabaseError(err, res, "Chyba při mazání pojištěnce");
      if (this.changes === 0) return res.status(404).json({ message: "Pojištěnec nenalezen" });
      res.json({ message: "Pojištěnec a jeho pojištění smazáno" });
    });
  });
});

// --------- INSURANCE TYPES ----------
app.get("/api/insuranceTypes", (req, res) => {
  const sql = `
    SELECT t.id, t.name, COUNT(i.id) AS pocetPojisteni
    FROM insuranceTypes t
    LEFT JOIN insurances i ON t.id = i.typeId
    GROUP BY t.id
    ORDER BY t.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return handleDatabaseError(err, res, "Chyba při načítání typů pojištění");
    const data = (rows || []).map(r => ({ ...r, pocetPojisteni: Number(r.pocetPojisteni) || 0 }));
    res.json(data);
  });
});

app.post("/api/insuranceTypes", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Název typu pojištění je povinný" });
  const sql = `INSERT INTO insuranceTypes (name) VALUES (?)`;
  db.run(sql, [name], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE")) return res.status(400).json({ message: "Typ pojištění s tímto názvem již existuje" });
      return handleDatabaseError(err, res, "Chyba při vytváření typu pojištění");
    }
    res.status(201).json({ id: this.lastID, name });
  });
});

app.put("/api/insuranceTypes/:id", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Název typu pojištění je povinný" });
  const sql = `UPDATE insuranceTypes SET name=? WHERE id=?`;
  db.run(sql, [name, req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při aktualizaci typu pojištění");
    if (this.changes === 0) return res.status(404).json({ message: "Typ pojištění nenalezen" });
    res.json({ id: req.params.id, name });
  });
});

app.delete("/api/insuranceTypes/:id", (req, res) => {
  db.run("DELETE FROM insuranceTypes WHERE id = ?", [req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při mazání typu pojištění");
    if (this.changes === 0) return res.status(404).json({ message: "Typ pojištění nenalezen" });
    res.json({ message: "Typ pojištění byl smazán" });
  });
});

// --------- INSURANCES ----------
app.get("/api/insurances", (req, res) => {
  let { page = 1, limit = 10, type, insuredName } = req.query;
  page = parseInt(page); limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const whereClauses = [];
  const params = [];

  if (type) { whereClauses.push("i.typeId=?"); params.push(type); }
  if (insuredName) { whereClauses.push("(ins.firstName || ' ' || ins.lastName) LIKE ?"); params.push(`%${insuredName}%`); }
  const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

  const countSQL = `SELECT COUNT(*) AS total FROM insurances i JOIN insureds ins ON i.insuredId = ins.id ${whereSQL}`;
  db.get(countSQL, params, (err, countRow) => {
    if (err) return handleDatabaseError(err, res, "Chyba při počítání pojištění");
    const totalPages = Math.ceil((countRow?.total || 0)/limit);

    const sql = `
      SELECT i.id, i.amount, i.subject, i.validFrom, i.validTo,
             ins.id AS insuredId, ins.firstName, ins.lastName,
             t.id AS typeId, t.name AS typeName
      FROM insurances i
      JOIN insureds ins ON i.insuredId = ins.id
      JOIN insuranceTypes t ON i.typeId = t.id
      ${whereSQL}
      ORDER BY i.id DESC
      LIMIT ? OFFSET ?
    `;
    db.all(sql, [...params, limit, offset], (err, rows) => {
      if (err) return handleDatabaseError(err, res, "Chyba při načítání pojištění");
      res.json({ data: rows || [], totalPages });
    });
  });
});

app.post("/api/insurances", (req, res) => {
  const { typeId, amount, insuredId, subject, validFrom, validTo } = req.body;
  if (!typeId || !amount || !insuredId || !subject || !validFrom || !validTo)
    return res.status(400).json({ message: "Chybí povinná pole" });
  const sql = `INSERT INTO insurances (typeId, amount, insuredId, subject, validFrom, validTo)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [typeId, amount, insuredId, subject, validFrom, validTo], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při vytváření pojištění");
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

app.put("/api/insurances/:id", (req, res) => {
  const { typeId, amount, insuredId, subject, validFrom, validTo } = req.body;
  const sql = `UPDATE insurances SET typeId=?, amount=?, insuredId=?, subject=?, validFrom=?, validTo=? WHERE id=?`;
  db.run(sql, [typeId, amount, insuredId, subject, validFrom, validTo, req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při aktualizaci pojištění");
    if (this.changes === 0) return res.status(404).json({ message: "Pojištění nenalezeno" });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete("/api/insurances/:id", (req, res) => {
  db.run("DELETE FROM insurances WHERE id = ?", [req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při mazání pojištění");
    if (this.changes === 0) return res.status(404).json({ message: "Pojištění nenalezeno" });
    res.json({ message: "Pojištění bylo smazáno" });
  });
});

// --------- EVENTS ----------
app.get("/api/events", (req, res) => {
  const sql = `
    SELECT e.id, e.insuredId, e.title, e.description, e.date, e.status, e.payout,
           ins.firstName, ins.lastName
    FROM events e
    LEFT JOIN insureds ins ON e.insuredId = ins.id
    ORDER BY e.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return handleDatabaseError(err, res, "Chyba při načítání událostí");
    res.json(rows || []);
  });
});

app.post("/api/events", (req, res) => {
  const { insuredId, title, description, date, status="Rozpracováno", payout=0 } = req.body;
  if (!insuredId || !title || !date) return res.status(400).json({ message: "Chybí povinná pole" });
  const sql = `INSERT INTO events (insuredId, title, description, date, status, payout) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [insuredId, title, description, date, status, payout], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při vytváření události");
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});

app.put("/api/events/:id", (req, res) => {
  const { insuredId, title, description, date, status, payout } = req.body;
  const sql = `UPDATE events SET insuredId=?, title=?, description=?, date=?, status=?, payout=? WHERE id=?`;
  db.run(sql, [insuredId, title, description, date, status, payout, req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při aktualizaci události");
    if (this.changes === 0) return res.status(404).json({ message: "Událost nenalezena" });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete("/api/events/:id", (req, res) => {
  db.run("DELETE FROM events WHERE id = ?", [req.params.id], function(err) {
    if (err) return handleDatabaseError(err, res, "Chyba při mazání události");
    if (this.changes === 0) return res.status(404).json({ message: "Událost nenalezena" });
    res.json({ message: "Událost byla smazána" });
  });
});

// --------- HEALTH CHECK ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ======================== SPUŠTĚNÍ SERVERU ========================
app.listen(PORT, () => {
  console.log(`🚀 Server běží na http://localhost:${PORT}`);
});
