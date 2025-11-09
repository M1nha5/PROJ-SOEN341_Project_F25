import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const token =
            (header.startsWith("Bearer ") && header.split(" ")[1]) ||
            req.cookies?.token;

        if (!token) return res.status(401).json({ error: "Unauthorized" });

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
