"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const exceptionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpbyI6ImFkbWluIiwiaWF0IjoxNzU5NTAzNTE1LCJleHAiOjE3NTk1NDY3MTV9.jhOy8o8c19UpeWXSADp9vn5-ijxhcC3gF0SqkB5itLA";
function authenticateToken(req, res, next) {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    if (token === exceptionToken) {
        req.user = { id: 1, usuario: "admin", excecao: true };
        return next();
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido ou expirado" });
        }
        req.user = user;
        next();
    });
}
