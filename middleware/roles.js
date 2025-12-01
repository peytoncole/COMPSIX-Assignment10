function requireManager(req, res, next) {
  if (req.user.role === "manager" || req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Managers only" });
}

function requireAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admins only" });
}

module.exports = { requireManager, requireAdmin };
