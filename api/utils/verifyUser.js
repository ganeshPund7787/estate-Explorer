import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken"

export const verifyUser = (req, res, next) => {
    try {
        const { cookie } = req.cookies;

        if (!cookie) return next(errorHandler(401, "You should login first"))
        jwt.verify(cookie, process.env.JWT_TOKEN, (err, user) => {
            if (err) return next(errorHandler(403, "Invalid cookie"));
            req.user = user;
            next();
        })
    } catch (error) {
        next(error);
    }
}