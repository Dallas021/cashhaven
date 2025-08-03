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
/**
 * Envia uma mensagem de boas-vindas ao cliente recém-cadastrado.
 *
 * 📌 Regras de negócio:
 * - A mensagem inclui explicação sobre o programa de cashback.
 * - O valor mínimo de cashback para uso é obtido da tabela `sys`, linha com `id = 3`.
 * - A mensagem é enviada via Venom (WhatsApp), utilizando o número formatado com DDI +55.
 *
 * @param telefone - Número de telefone do cliente (somente números, ex: 71999998888)
 * @returns Objeto com sucesso ou erro da operação
 */
function welcomeMessage(telefone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const venomClient = (0, config_1.getVenomClient)();
            const venomError = (0, config_1.getVenomError)();
            // Verifica se o cliente Venom está ativo
            if (!venomClient) {
                return {
                    success: false,
                    msg: ["Venom Client não está disponível no momento."],
                };
            }
            // Consulta o valor mínimo necessário para utilizar cashback
            const querySdmin = "SELECT value FROM sys where id = 3";
            const [resultSdmin] = yield connection_1.default.query(querySdmin);
            const sdmin = resultSdmin[0].value;
            // Mensagem personalizada de boas-vindas
            const message = `
🌟 Bem-vindo à Toca do Açaí! 🌟

Ficamos muito felizes em ter você como cliente. Aqui, além de saborear o melhor açaí da região, você acumula *cashback* em todas as suas compras!

💰 Como funciona o Cashback?
A cada compra que você fizer, você vai acumular um saldo de cashback. Quando esse saldo atingir R$ ${sdmin} ou mais, você poderá utilizá-lo como desconto nas suas próximas compras!

🍧 Não perca a oportunidade de aproveitar ainda mais nossos deliciosos açaís com descontos exclusivos.

Fique à vontade para aproveitar todos os benefícios e continue saboreando o melhor do açaí! 😋
`;
            const tele = `55${telefone}@c.us`; // Formata o número para o padrão do WhatsApp
            yield venomClient.sendText(tele, message);
            return {
                success: true,
                msg: ["Boas-vindas enviadas com sucesso"],
            };
        }
        catch (error) {
            console.error("Erro na função welcome:", error);
            // Trata erro específico de número inexistente
            if (error.text == "The number does not exist") {
                return {
                    success: false,
                    error: ["Número informado não existe"]
                };
            }
            return {
                success: false,
                msg: [`Erro ao enviar boas-vindas: ${error}`],
            };
        }
    });
}
/**
 * Envia ao cliente o saldo atual de cashback.
 *
 * 📌 Regras de negócio:
 * - A função busca o nome, saldo de cashback e telefone do cliente pelo `id`.
 * - O WhatsApp é utilizado para informar o cliente do valor disponível em cashback.
 *
 * @param id - ID do cliente na tabela `client`
 * @returns Objeto com sucesso ou erro da operação
 */
function clientPoint(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT name, point, tel FROM client WHERE id = ?";
        const [infoClient] = yield connection_1.default.query(query, [id]);
        const clientName = infoClient[0].name;
        const clientPoint = infoClient[0].point;
        const clientPhone = infoClient[0].tel;
        console.log("Query: ", query);
        console.log("Nome do cliente: ", clientName);
        console.log("Cashback do cliente: ", clientPoint);
        console.log("Telefone do cliente: ", clientPhone);
        const venomClient = (0, config_1.getVenomClient)();
        // Mensagem de saldo de cashback personalizada
        const message = `Oi, ${clientName}! 😊
O seu saldo de cashback é de R$ ${clientPoint}. Use-o para tornar a sua próxima compra ainda mais especial! 💕 Estamos ansiosos por vê-lo(a) novamente.

Um abraço,
Toca do Açaí­`;
        const tele = `55${clientPhone}@c.us`;
        yield venomClient.sendText(tele, message);
        return {
            success: true,
            msg: ["Saldo do cliente enviado com sucesso"]
        };
    });
}
exports.default = {
    welcomeMessage,
    clientPoint
};
