const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const mysql = require("mysql2/promise");

// ✅ Correct Sequelize import
const sequelize = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const materialRoutes = require("./routes/materialRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ---- SECURITY ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// ---- CORS ----
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// ---- API ROUTES ----
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/users", userRoutes);

// ---- HEALTH CHECK ----
app.get("/", (req, res) => {
  res.json({ message: "Yarn Inventory API is LIVE 🔥" });
});

// ---- TEMP ROUTE: DB IMPORT ----
app.get("/import-db", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "dump.sql");

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("dump.sql not found");
    }

    const sql = fs.readFileSync(filePath, "utf8");

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    await conn.query(sql);
    await conn.end();

    return res.send("Database import complete!");
  } catch (err) {
    console.error("IMPORT ERROR:", err);
    return res.status(500).send("Import failed: " + err.message);
  }
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL via Sequelize");

    await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Sequelize Connection Error:", err);
  }
})();
