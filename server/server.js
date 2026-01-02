const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const fs = require("fs");

dotenv.config();
connectDB();

const app = express();

/* =======================
   CORS CONFIG (FIXED)
   ======================= */

const corsOptions = {
  origin: process.env.CLIENT_URL, // EXACT match, no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 THIS IS THE FIX

/* =======================
   BODY PARSER
   ======================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES
   ======================= */

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/products", require("./routes/productRoute"));

/* =======================
   STATIC UPLOADS
   ======================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* =======================
   ERROR HANDLER
   ======================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* =======================
   START SERVER
   ======================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
