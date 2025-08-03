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
function allUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT id, nome, user as usuario FROM user WHERE D_E_L_E_T_ IS NULL OR D_E_L_E_T_ = '' ";
        const [result] = yield connection_1.default.query(query);
        console.log(result);
        return {
            success: true,
            message: result
        };
    });
}
function dellUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "UPDATE user SET D_E_L_E_T_ = '*' WHERE id = ?";
        try {
            const [result] = yield connection_1.default.query(query, [id]);
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: ["Usuário do sistema excluído com sucesso"]
                };
            }
            else {
                return {
                    success: false,
                    message: ["Nenhum usuário encontrado com o ID fornecido"]
                };
            }
        }
        catch (error) {
            console.error("Erro ao excluir usuário:", error);
            return {
                success: false,
                message: ["Erro ao excluir usuário"]
            };
        }
    });
}
function editUser(nome, cargo, adm, senha, user, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedSenha = yield bcrypt_1.default.hash(senha, 10);
            const query = "UPDATE user SET nome = ?, cargo = ?, adm = ?, senha = ?, user = ? WHERE id = ?";
            const [result] = yield connection_1.default.query(query, [nome, cargo, adm, hashedSenha, user, id]);
            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "Nenhum usuário foi alterado. Verifique se o ID informado é válido."
                };
            }
            return {
                success: true,
                message: "Usuário alterado com sucesso"
            };
        }
        catch (error) {
            console.error("Erro ao alterar usuário:", error);
            return {
                success: false,
                error: error
            };
        }
    });
}
exports.default = {
    allUser,
    dellUser,
    editUser
};
