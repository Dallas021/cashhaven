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
function allStock() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT id, product as produto, sd as saldo, p_custo as preco_custo, p_venda as preco_venda, forn as ultimo_fonecedor FROM stock WHERE D_E_L_E_T_ IS NULL OR D_E_L_E_T_ = ''";
        const [result] = yield connection_1.default.query(query);
        if (result.length === 0) {
            return {
                success: true,
                message: ["Nenhum produto encontrado"]
            };
        }
        return {
            success: true,
            message: result
        };
    });
}
function insertStock(produto, compra, venda, fornecedor, saldo) {
    return __awaiter(this, void 0, void 0, function* () {
        const validations = [
            { condition: !fornecedor, error: "É necessário informar o fornecedor" },
            { condition: !produto, error: "É necessário informar o nome do produto" },
            { condition: compra <= 0, error: "O preço de compra deve ser maior que zero" },
            { condition: venda <= 0, error: "O preço de venda deve ser maior que zero" },
            { condition: saldo < 0, error: "O saldo não pode ser negativo" },
        ];
        for (const validation of validations) {
            if (validation.condition) {
                return {
                    success: false,
                    error: [validation.error],
                };
            }
        }
        const query = "INSERT INTO stock (product, p_custo, p_venda, forn, sd) VALUES (?,?,?,?,?)";
        const [result] = yield connection_1.default.query(query, [produto, compra, venda, fornecedor, saldo]);
        const [junt] = yield connection_1.default.query("SELECT id FROM stock WHERE product = ? AND p_custo = ?", [produto, compra]);
        const id = junt[0].id;
        const query2 = "INSERT INTO nsd (productid, old_sd, p_custo, forn, new_sd, date, time) VALUES (?,0,?,?,?,curdate(),curtime());";
        const [insertNSD] = yield connection_1.default.query(query2, [id, compra, fornecedor, saldo]);
        return {
            success: true,
            message: ["Produto cadastrado com sucesso"],
        };
    });
}
function insertSD(id, saldo, fornecedor, compra) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryOldSd = "SELECT sd FROM stock WHERE id = ?";
        const [resultOldSd] = yield connection_1.default.query(queryOldSd, [id]);
        if (resultOldSd.length === 0) {
            throw new Error("Produto não encontrado");
        }
        const oldSD = resultOldSd[0].sd;
        const query = "INSERT INTO nsd (productid, old_sd, new_sd, forn, p_custo, date, time) VALUES (?,?,?,?,?,curdate(), curtime())";
        yield connection_1.default.query(query, [id, oldSD, saldo, fornecedor, compra]);
        return {
            success: true,
            message: ["Saldo inserido com sucesso"]
        };
    });
}
function modifyProduct(nome, venda, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "UPDATE stock SET product = ?, p_venda = ? WHERE id = ?";
        const [result] = yield connection_1.default.query(query, [nome, venda, id]);
        return {
            success: true,
            message: ["Produto atualizado com sucesso"]
        };
    });
}
function deleteProduct(pid) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "UPDATE stock SET D_E_L_E_T_ = '*' WHERE id = ?";
        const [result] = yield connection_1.default.query(query, [pid]);
        return {
            success: true,
            message: ["Produto excluído com sucesso"]
        };
    });
}
function serachID(pid) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT * FROM stock WHERE id = ?";
        const [result] = yield connection_1.default.query(query, [pid]);
        return {
            success: true,
            message: result
        };
    });
}
function serachName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT * FROM stock WHERE product LIKE ?";
        const [result] = yield connection_1.default.query(query, [`%${name}%`]);
        return {
            success: true,
            message: result
        };
    });
}
exports.default = {
    allStock,
    insertStock,
    insertSD,
    modifyProduct,
    deleteProduct,
    serachID,
    serachName
};
