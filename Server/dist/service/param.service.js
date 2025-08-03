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
function allParams() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT id, name as parametro, value as valor, bit FROM sys";
        const [result] = yield connection_1.default.query(query);
        return {
            success: true,
            message: result
        };
    });
}
function updateParams(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "UPDATE sys SET value = ?, bit = ? WHERE id = ?";
        const connection = yield connection_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            for (const { valor, bit, id } of params) {
                console.log("Query", query);
                console.log("Valores:   valor: ", valor, "BIT: ", bit, "ID: ", id);
                yield connection.query(query, [valor, bit, id]);
            }
            yield connection.commit();
            return {
                success: true,
                message: ["Parâmetros atualizados com sucesso"]
            };
        }
        catch (error) {
            yield connection.rollback();
            return {
                success: false,
                message: ["Erro ao atualizar parâmetros"]
            };
        }
        finally {
            connection.release();
        }
    });
}
function whatsappServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const [whatsapp] = yield connection_1.default.query("SELECT bit FROM sys WHERE id = 12");
        const whatsappServer = whatsapp[0].bit;
        return {
            bit: whatsappServer
        };
    });
}
exports.default = {
    allParams,
    updateParams,
    whatsappServer
};
