const jwt = require("jsonwebtoken");

// block requests without valid login
function authRequired(req, res, next) {
  try {
    // token comes from cookie
    const token = req.cookies.session;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // continue to route
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authRequired;
