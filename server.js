const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const SubmissionSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  inclusiveVision: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', SubmissionSchema);

// Submissions go directly to this WhatsApp number via wa.me link (no third party, no database)
const WHATSAPP_NUMBER = "233544209788";

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body." });
  }
  next(err);
});
app.use(express.static(path.join(__dirname, "public")));

// Health check for Render
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

function sendJson(res, status, data) {
  res.setHeader("Content-Type", "application/json");
  res.status(status).end(JSON.stringify(data));
}

app.post("/api/submit", async (req, res) => {
  try {
    const body = req.body != null && typeof req.body === "object" ? req.body : {};
    const firstName = String(body.firstName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const inclusiveVision = String(body.inclusiveVision ?? "").trim();

    if (!firstName || !email || !inclusiveVision) {
      return sendJson(res, 400, { success: false, message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendJson(res, 400, { success: false, message: "Please enter a valid email address." });
    }

    const submission = new Submission({
      firstName,
      email,
      inclusiveVision
    });
    await submission.save();

    return sendJson(res, 200, { success: true });
  } catch (err) {
    console.error("Submission error:", err);
    return sendJson(res, 500, { success: false, message: "Server error. Please try again later." });
  }
});

app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 }).limit(50);
    sendJson(res, 200, { success: true, submissions });
  } catch (err) {
    console.error("List submissions error:", err);
    sendJson(res, 500, { success: false, message: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (!res.headersSent) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).end(JSON.stringify({ success: false, message: "Server error. Please try again later." }));
  }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}

startServer();
