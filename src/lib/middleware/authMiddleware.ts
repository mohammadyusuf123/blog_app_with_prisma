
import { Request, Response, NextFunction } from "express";
import { auth } from "../../lib/auth";

//namespace
declare global {
    namespace Express {
        interface Request {
            user?:{
                id: string,
                email: string,
                name: string,
                role: string,
                emailVerified: boolean

            }
        }
    }
}
export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}
//authmiddleware
export const authMiddleware = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
    try {
       //get user session
        const session = await auth.api.getSession({
            headers: req.headers as any
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                 message: "You are not authorized"});
        }
        if (!session.user.emailVerified) {
             return res.status(401).json({
                success: false,
                 message: "Email is not verified",
             });

        }
        if (roles.length && !roles.includes(session.user.role as UserRole)) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized",
            });
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        };

       
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
}
};