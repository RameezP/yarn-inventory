const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // 1. Import Rate Limit
require("dotenv").config();

const sequelize = require("./config/db");
require("./models/index"); 

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const materialRoutes = require("./routes/materialRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 2. Security: Rate Limiter (Limit each IP to 100 requests per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// 3. Security: Strict CORS (Only allow Frontend on port 3000)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Yarn Inventory API Secured 🔒" });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection established via Sequelize.");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
  }
})();