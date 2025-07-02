/**
 * Middleware to authorize user based on role(s)
 * @param {string|string[]} allowedRoles - Role atau array of roles yang diizinkan (contoh: 'admin' atau ['admin', 'user'])
 */
function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden. Role tidak diizinkan." });
    }

    next();
  };
}

module.exports = authorizeRole;
