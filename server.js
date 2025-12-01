require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { User, Task } = require("./database/setup");
const { requireAuth } = require("./middleware/auth");
const { requireManager, requireAdmin } = require("./middleware/roles");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// ---------- AUTH ENDPOINTS ----------

// REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ user, token });
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ user, token });
});

// HEALTH CHECK (for auto-deploy test)
app.get("/api/health", (req, res) => {
  res.json({ status: "API running", time: new Date() });
});

// ---------- TASK ENDPOINTS ----------

// Get all tasks
app.get("/api/tasks", requireAuth, async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

// Create task
app.post("/api/tasks", requireAuth, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    UserId: req.user.id
  });

  res.json(task);
});

// ---------- ADMIN ENDPOINT ----------
app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});