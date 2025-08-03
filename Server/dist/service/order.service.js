"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv = __importStar(require("dotenv"));
const nfc_service_1 = __importDefault(require("./nfc.service"));
dotenv.config();
/**
 * 🧾 Cria um pedido completo (produtos, pagamentos e clientes).
 *
 * 📌 Regras de negócio:
 * - Valida se o cliente já está cadastrado antes de continuar (caso `uid != 0`);
 * - Insere os produtos comprados na tabela `pedno`;
 * - Insere os dados de pagamento na tabela `pay`;
 *     - Se `cb = 1`, aplica desconto via cashback e valida saldo;
 *     - Se `cb = 0`, calcula e credita o valor de cashback (baseado em %);
 *     - Integra com NFC-e (via `nfcService`) se o tipo de pagamento exigir e se o parâmetro Sefaz estiver igual a 1 (ID 9 tabela sys);
 * - Insere os dados dos clientes na tabela `purchases`;
 * - Libera a mesa usada (t2 = 0) e marca os pedidos da mesa como finalizados (`bit = 0`);
 * - Toda a operação ocorre dentro de uma transação.
 *
 * @param order - Objeto contendo os arrays abaixo:
 *
 * Estrutura do objeto `order`:
 * {
 *   produtos: Produto[],   // Produtos do pedido
 *   pagamentos: Pagamento[], // Formas de pagamento usadas
 *   clients: Client[]       // Clientes relacionados ao pedido
 * }
 *
 * --- Estrutura dos arrays ---
 *
 * Produto {
 *   pedido: number;         // ID do pedido ao qual o produto pertence
 *   prodno: number;         // ID do produto
 *   valor_unit: number;     // Valor unitário do produto
 *   unino: number;          // Quantidade do produto
 *   sta: string;            // Status do produto (ex: 'A' para ativo)
 *   userno: number;         // Usuário que registrou o produto
 *   produto_nome?: string;  // Nome do produto (opcional)
 * }
 *
 * Pagamento {
 *   pedido: number;         // ID do pedido ao qual o pagamento pertence
 *   tipo: string;           // Tipo de pagamento (ex: '0' = PIX, '1' = Dinheiro, '2' = Crédito, '3' = Débito)
 *   valor_recebido: number; // Valor recebido na forma de pagamento
 *   valor_pedido: number;   // Valor total do pedido
 *   cb?: number;            // Indicador de uso de cashback (0 ou 1)
 *   price_cb?: number;      // Valor do cashback usado (se aplicável)
 *   bit: number;            // Troco ou campo obrigatório para validação
 * }
 *
 * Client {
 *   pedido: number;         // ID do pedido associado ao cliente
 *   uid: number;            // ID do cliente (0 se cliente genérico / balcão)
 *   cashback: number;       // Cashback acumulado para o cliente - Se pagamento.cb = 1 não gera cashback
 *   cpf?: string;           // CPF do cliente (usado para validações)
 *   tableid?: number;       // ID da mesa (0 se pedido balcão)
 *   op?: number;            // Operador responsável pelo pedido
 * }
 *
 * --- Diferenças na estrutura para pedido Mesa e Balcão ---
 *
 * Pedido Mesa:
 * - `tableid` > 0 (mesa física vinculada)
 * - Pode ter múltiplos clientes no array `clients` (ex: grupo na mesma mesa)
 * - Após finalizado, libera mesa e marca pedidos mesa como finalizados
 *
 * Pedido Balcão:
 * - `tableid` == 0 (sem mesa)
 * - Normalmente apenas um cliente (pode ter `uid` == 0 para cliente genérico)
 * - Não há liberação de mesa nem controle de pedidos mesa
 *
 * @returns Objeto com status da operação: sucesso ou erro, com mensagens detalhadas.
 */
function createOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let connection;
        try {
            connection = yield connection_1.default.getConnection();
            yield connection.beginTransaction();
            for (const client of order.clients) {
                if (client.uid !== 0) {
                    const [rows] = yield connection_1.default.query("SELECT * FROM client WHERE id = ?", [client.uid]);
                    if (rows.length === 0) {
                        return {
                            success: false,
                            error: `Cliente com UID ${client.uid} não cadastrado.`,
                        };
                    }
                }
            }
            for (const produto of order.produtos) {
                const sql = `INSERT INTO pedno (pedido, prodno, valor_unit, unino, data_fechamento, sta, userno) 
                   VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`;
                const values = [
                    produto.pedido,
                    produto.prodno,
                    produto.valor_unit,
                    produto.unino,
                    produto.sta,
                    produto.userno,
                ];
                const [nome_produto] = yield connection.query("SELECT product FROM stock where id = ?", produto.prodno);
                const produto_nome = nome_produto[0].product;
                yield connection.query(sql, values);
            }
            for (const pagamento of order.pagamentos) {
                if (pagamento.bit == null || pagamento.bit == undefined) {
                    return {
                        success: false,
                        error: "Informe o valor de troco"
                    };
                }
                const sqlpay = `INSERT INTO pay (pedido, tipo, valor_recebido, valor_pedido, cb, price_cb, bit) 
                      VALUES (?,?,?,?,?,?,?)`;
                const values2 = [
                    pagamento.pedido,
                    pagamento.tipo,
                    pagamento.valor_recebido,
                    pagamento.valor_pedido,
                    pagamento.cb,
                    pagamento.price_cb,
                    pagamento.bit
                ];
                yield connection.query(sqlpay, values2);
                if (pagamento.cb == 1 && pagamento.price_cb !== undefined) {
                    for (const client of order.clients) {
                        const [resultParam] = yield connection_1.default.query("SELECT value FROM sys WHERE id = 6");
                        const sdmin = Number((_b = (_a = resultParam[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0);
                        const [rows] = yield connection_1.default.query("SELECT point FROM client WHERE id = ?", [client.uid]);
                        const saldoAtual = Number((_d = (_c = rows[0]) === null || _c === void 0 ? void 0 : _c.point) !== null && _d !== void 0 ? _d : 0);
                        if (saldoAtual < pagamento.price_cb) {
                            return { success: false, error: `Saldo insuficiente: saldo atual ${saldoAtual}, necessário ${pagamento.price_cb}` };
                        }
                        const queryDesconto = "UPDATE client SET point = point - ? WHERE id = ?";
                        yield connection_1.default.query(queryDesconto, [pagamento.price_cb, client.uid]);
                    }
                }
                else if (pagamento.cb === 0) {
                    for (const client of order.clients) {
                        const [paramPorcentagem] = yield connection_1.default.query("SELECT value FROM sys WHERE id = 2");
                        const porcentagem = (_f = (_e = paramPorcentagem[0]) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : 0;
                        const [saldo_atual] = yield connection_1.default.query("SELECT point FROM client WHERE id = ?", [client.uid]);
                        const saldoAtual = Number((_h = (_g = saldo_atual[0]) === null || _g === void 0 ? void 0 : _g.point) !== null && _h !== void 0 ? _h : 0);
                        const cashback = Number(((porcentagem / 100) * pagamento.valor_recebido).toFixed(2));
                        const novo_saldo = saldoAtual + cashback;
                        yield connection_1.default.query("UPDATE client SET point = ? WHERE id = ?", [novo_saldo, client.uid]);
                    }
                    const [paramSefaz] = yield connection_1.default.query("SELECT bit FROM sys WHERE id = 9");
                    const sefaz = paramSefaz[0].bit;
                    console.log("Parâmetro sefaz", sefaz);
                    if ((pagamento.tipo == "2" || pagamento.tipo == "3") && sefaz == 1) {
                        for (const client of order.clients) {
                            try {
                                const produtosCliente = order.produtos.filter(produto => produto.pedido === client.pedido);
                                const url = client.uid !== 0
                                    ? yield nfc_service_1.default.trueUid(pagamento, client, produtosCliente)
                                    : yield nfc_service_1.default.falseUid(pagamento, client, produtosCliente);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                    }
                }
            }
            // Inserindo dados do cliente
            for (const client of order.clients) {
                if (client.uid === 0) {
                    client.cpf = "0";
                }
                const sqlClient = "INSERT INTO purchases (pedido, id_client, cashback, op, date, time) VALUES (?,?,?,?,CURDATE(),CURTIME())";
                const values3 = [client.pedido, client.uid, client.cashback, client.op];
                try {
                    if (client.tableid !== 0) {
                        const query = "UPDATE tables SET t2 = 0 WHERE id = ?";
                        yield connection_1.default.query(query, [client.tableid]);
                        const query2 = "UPDATE tableped SET bit = 0 WHERE tableid = ?";
                        yield connection_1.default.query(query2, [client.tableid]);
                    }
                }
                catch (error) {
                    return { success: false, error: error.message };
                }
                yield connection.query(sqlClient, values3);
            }
            yield connection.commit();
            return { success: true, message: "Pedido enviado com sucesso!" };
        }
        catch (error) {
            console.error("Erro ao inserir pedido:", error);
            if (connection) {
                yield connection.rollback();
            }
            if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED' && error.sqlMessage.includes('chk_negativar_saldo')) {
                console.error("Erro de saldo insuficiente detectado:", error.sqlMessage);
                const produtoComErro = order.produtos.find(produto => produto.prodno);
                if (produtoComErro) {
                    try {
                        const [rows] = yield connection_1.default.query("SELECT sd FROM stock WHERE id = ?", [produtoComErro.prodno]);
                        const saldoAtual = (_j = rows[0]) === null || _j === void 0 ? void 0 : _j.sd;
                        return {
                            success: false,
                            error: `Produto sem estoque. Saldo atual: ${saldoAtual}, saldo de venda: ${produtoComErro.valor_unit}`,
                        };
                    }
                    catch (saldoError) {
                        console.error("Erro ao consultar saldo:", saldoError);
                    }
                }
                return { success: false, error: "Produto sem estoque. Saldo insuficiente." };
            }
            return { success: false, error: "Erro ao enviar pedido", details: error.message };
        }
        finally {
            if (connection) {
                connection.release();
            }
        }
    });
}
/**
 * 🔢 Retorna o próximo número de pedido (incrementando o maior valor atual em `pedno`).
 *
 * 📌 Regras de negócio:
 * - Busca o maior valor de `pedido` na tabela `pedno` e soma 1.
 * - Se não houver nenhum registro, retorna 1 como valor inicial.
 *
 * @returns Novo número de pedido sugerido
 */
function orderNext() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const query = "SELECT MAX(pedido) + 1 AS neworder FROM pedno";
        const [result] = yield connection_1.default.query(query);
        const neworder = (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.neworder) !== null && _b !== void 0 ? _b : 1;
        return {
            success: true,
            pedido: neworder,
        };
    });
}
/**
 * 🧾 Armazena o retorno da emissão da NFC-e no banco de dados.
 *
 * 📌 Regras de negócio:
 * - Registra as informações da nota fiscal no painel NFC-e.
 *
 * @param uuid - Identificador único
 * @param status - Status da nota
 * @param motivo - Motivo do retorno
 * @param nfe - Número da nota fiscal
 * @param serie - Série da NFe
 * @param modelo - Modelo da NFe
 * @param recibo - Número de recibo
 * @param chave - Chave de acesso da NFe
 * @returns Mensagem de confirmação
 */
function panelNFC(uuid, status, motivo, nfe, serie, modelo, recibo, chave) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "INSERT INTO panel_nfc (uuid, status, motivo, nfe, serie, modelo, recibo, chave) VALUES (?,?,?,?,?,?,?,?)";
        const [result] = yield connection_1.default.query(query, [uuid, status, motivo, nfe, serie, modelo, recibo, chave]);
        return {
            success: true,
            message: "Retorno do emissor ok",
        };
    });
}
exports.default = {
    createOrder,
    orderNext,
    panelNFC,
};
