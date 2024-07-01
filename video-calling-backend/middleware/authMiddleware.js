import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  console.log("Cookies: ", req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
