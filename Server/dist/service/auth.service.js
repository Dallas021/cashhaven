"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
function loginUser(usuario, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `
      SELECT 
        id, 
        UPPER(nome) AS nome, 
        user AS usuario, 
        senha,
        cargo
      FROM user
      WHERE user = ?
    `;
            const values = [usuario];
            const [results] = yield connection_1.default.query(query, values);
            const users = results;
            if (users.length === 1) {
                const user = users[0];
                const isPasswordValid = yield bcrypt_1.default.compare(senha, user.senha);
                if (isPasswordValid) {
                    const payload = { id: user.id, usuario: user.usuario };
                    const token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: "12h" });
                    const decodedToken = jsonwebtoken_1.default.decode(token);
                    const expirationDate = new Date(decodedToken.exp * 1000);
                    return {
                        success: true,
                        token,
                        expiration: expirationDate,
                        nome: user.nome,
                        id: user.id,
                        jwt: user.senha,
                        cargo: user.cargo
                    };
                }
                else {
                    return { success: false, errors: ["Senha incorreta"] };
                }
            }
            else {
                return {
                    success: false,
                    errors: ["Usuário não encontrado"],
                    code: 404
                };
            }
        }
        catch (error) {
            return { success: false, errors: ["Erro no Banco de Dados"], details: error };
        }
    });
}
function registerUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nome, nome_usuario, senha, cargo, adm } = userData;
            const hashedSenha = yield bcrypt_1.default.hash(senha, 10);
            const query = `INSERT INTO user (nome, user, senha, cargo, adm, sys) VALUES (?, ?, ?, ?, ?, 0)`;
            const values = [nome, nome_usuario, hashedSenha, cargo, adm];
            yield connection_1.default.query(query, values);
            return { success: true, message: "Usuário cadastrado com sucesso" };
        }
        catch (error) {
            return { success: false, error: "Erro ao cadastrar usuário", details: error };
        }
    });
}
exports.default = {
    loginUser,
    registerUser
};
