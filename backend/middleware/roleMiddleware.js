export const requireRole = (role) => (req, res, next) => {
  const user = req.body.user;
  if (user?.role !== role) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};
