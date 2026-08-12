require("dotenv").config();
require("express-async-errors");
const http = require("http");
const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./lib/db");
const socketServer = require("./lib/socketServer");
const { startWorker } = require("./queue/worker");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const caseRoutes = require("./routes/cases");
const queueRoutes = require("./routes/queue");
const reportRoutes = require("./routes/reports");
const shareRoutes = require("./routes/shares");
const auditRoutes = require("./routes/audit");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "5mb" }));

app.use("/files", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", async (req, res) => {
  let dbOk = false;
  try { await pool.query("SELECT 1"); dbOk = true; } catch { dbOk = false; }
  res.json({ ok: true, db: dbOk, service: "aipath-assist-backend", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found." }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error." });
});

// Wrap Express in a plain http.Server so Socket.IO can attach to it.
const httpServer = http.createServer(app);
socketServer.init(httpServer);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`AI-Path Assist backend listening on http://localhost:${PORT}`);
  console.log(`Socket.IO ready at ws://localhost:${PORT}`);
});

if (process.env.RUN_WORKER_IN_PROCESS !== "false") {
  startWorker();
}
