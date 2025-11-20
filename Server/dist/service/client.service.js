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
const config_1 = require("../utils/wpp/config");
function allClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT id, cpf, tel as telefone, name as nome FROM client WHERE D_E_L_E_T_ IS NULL OR D_E_L_E_T_ = ''";
        const [result] = yield connection_1.default.query(query);
        return {
            success: true,
            message: result
        };
    });
}
function serachClient(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT id, name as nome, cpf, point as cashback FROM client WHERE cpf = ?";
            const [result] = yield connection_1.default.query(query, [uid]);
            if (result.length === 0) {
                return {
                    success: true,
                    message: ["NÃ£o existe cliente cadastrado com esse cpf"]
                };
            }
            return {
                success: true,
                message: result
            };
        }
        catch (error) {
            console.error("erro", error);
            return {
                success: false,
                message: error
            };
        }
    });
}
function serachClientById(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT id, name as nome, cpf, point as cashback FROM client WHERE id = ?";
        const [result] = yield connection_1.default.query(query, [uid]);
        if (result.length === 0) {
            return {
                success: true,
                message: ["Não existe cliente cadastrado com esse cpf"]
            };
        }
        return {
            success: true,
            message: result
        };
    });
}
function updateClient(id, nome, telefone, cpf) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "UPDATE client SET name = ?, tel = ?, cpf = ? WHERE id = ?";
            const [result] = yield connection_1.default.query(query, [nome, telefone, cpf, id]);
            return {
                success: true,
                message: ["Informações do cliente atualizadas com sucesso"]
            };
        }
        catch (error) {
            console.error(error);
            return {
                success: false,
                error: error
            };
        }
    });
}
function clientCreate(cpf, name, tel) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "INSERT INTO client (cpf, name, tel, point) VALUES (?, ?, ?, 0)";
        let venomErrorStatus = null;
        try {
            const [result] = yield connection_1.default.query(query, [cpf, name, tel]);
            const querySdmin = "SELECT value FROM sys WHERE id = 3";
            const [resultSdmin] = yield connection_1.default.query(querySdmin);
            const sdmin = resultSdmin[0].value;
            if (result.affectedRows === 1) {
                const tele = `55${tel}@c.us`;
                const message = `
🌟 Bem-vindo à Toca do Açaí! 🌟

Ficamos muito felizes em ter você como cliente. Aqui, além de saborear o melhor açaí da região, você acumula *cashback* em todas as suas compras!

💰 Como funciona o Cashback?
A cada compra que você fizer, você vai acumular um saldo de cashback. Quando esse saldo atingir R$ ${sdmin} ou mais, você poderá utilizá-lo como desconto nas suas próximas compras!

🍧 Não perca a oportunidade de aproveitar ainda mais nossos deliciosos açaís com descontos exclusivos.

Fique à vontade para aproveitar todos os benefícios e continue saboreando o melhor do açaí! 😋
`;
                yield (0, config_1.sendWhatsappMessage)(tele, message);
                return {
                    success: true,
                    message: ["Cliente criado com sucesso"],
                    venomStatus: venomErrorStatus
                        ? ["Atenção: " + venomErrorStatus]
                        : ["Mensagem enviada com sucesso"],
                };
            }
            else {
                return {
                    success: false,
                    message: ["Erro ao criar cliente no banco de dados"],
                };
            }
        }
        catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return {
                    success: false,
                    message: ["Cliente já cadastrado"],
                };
            }
            throw error;
        }
    });
}
function deleteClient(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteQuery = "UPDATE client SET D_E_L_E_T_ = '*' WHERE id = ?";
        const [result] = yield connection_1.default.query(deleteQuery, [uid]);
        return {
            success: true,
            message: ["Cliente excluído com sucesso"]
        };
    });
}
exports.default = {
    allClient,
    serachClient,
    updateClient,
    clientCreate,
    deleteClient,
    serachClientById
};
