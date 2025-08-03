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
/**
 * 🔍 Retorna todas as mesas ativas do sistema.
 *
 * 📌 Regras de negócio:
 * - Filtra apenas mesas onde `t1 = 1` e que não estejam marcadas como deletadas (`D_E_L_E_T_ <> '*'`).
 *
 * @returns Todas as mesas disponíveis e ativas.
 */
function allTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT * FROM tables WHERE t1 = 1 and D_E_L_E_T_ = '' OR D_E_L_E_T_ IS NULL";
        const [result] = yield connection_1.default.query(query);
        return {
            success: true,
            message: result
        };
    });
}
/**
 * ➕ Cadastra uma nova mesa no sistema.
 *
 * 📌 Regras de negócio:
 * - Sempre insere `t1 = 1` (ativa) e `t2 = 0` (mesa disponível).
 *
 * @param id - ID da nova mesa
 * @param referencia - Nome ou descrição da mesa
 * @returns Mensagem de sucesso ou erro
 */
function insertTable(id, referencia) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "INSERT INTO tables (id, referencia, t1, t2) VALUES (?, ?, 1, 0)";
            const [result] = yield connection_1.default.query(query, [id, referencia]);
            return {
                success: true,
                message: ["Mesa cadastrada com sucesso"]
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
/**
 * ❌ Exclui uma mesa com base no seu ID.
 *
 * @param uid - ID da mesa a ser excluída
 * @returns Mensagem de sucesso
 */
function deletTable(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "UPDATE tables SET D_E_L_E_T_ = '*' WHERE id = ?";
        const [result] = yield connection_1.default.query(query, [uid]);
        return {
            success: true,
            message: ["Mesa excluída com sucesso"]
        };
    });
}
/**
 * ➕ Insere uma lista de pedidos na tabela `tableped`.
 *
 * 📌 Regras de negócio:
 * - Para cada pedido, insere um registro na tabela `tableped`.
 * - Se o campo `bit` for `1`, a mesa correspondente é marcada como ocupada (`t2 = 1`).
 * - Toda a operação é feita dentro de uma transação.
 *
 * @param pedidos - Lista de pedidos a serem inseridos
 * @returns Mensagem de sucesso ou erro com controle de transação
 */
function insertTablePed(pedidos) {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            connection = yield connection_1.default.getConnection();
            yield connection.beginTransaction();
            const query = `INSERT INTO tableped (tableid, id_client, prodno, unino, valor_unit, valor_total, bit) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
            for (const pedido of pedidos) {
                const { tableid, uid, prodno, unino, valor_unit, valor_total, bit } = pedido;
                yield connection.query(query, [tableid, uid, prodno, unino, valor_unit, valor_total, bit]);
                if (bit === 1) {
                    // Marca a mesa como ocupada
                    const query = "UPDATE tables SET t2 = 1 WHERE id = ?";
                    const [result] = yield connection_1.default.query(query, [tableid]);
                }
            }
            yield connection.commit();
            return {
                success: true,
                message: 'Pedidos inseridos com sucesso.'
            };
        }
        catch (error) {
            if (connection) {
                yield connection.rollback();
            }
            return {
                success: false,
                error: error
            };
        }
        finally {
            if (connection) {
                connection.release();
            }
        }
    });
}
/**
 * 📦 Retorna todos os pedidos com status ativo (bit = 1).
 *
 * 📌 Regras de negócio:
 * - Junta a tabela `tableped` com `stock` para obter nome do produto.
 * - Filtra apenas registros onde `bit = 1` (ativos) e que não estejam excluídos logicamente.
 *
 * @returns Lista de pedidos em andamento (não finalizados)
 */
function pedTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
        SELECT tableid, id_client, stock.product, prodno, unino, valor_unit, valor_total, bit 
        FROM tableped 
        INNER JOIN stock ON stock.id = tableped.prodno 
        WHERE bit = 1 AND tableped.D_E_L_E_T_ IS NULL
    `;
        const [result] = yield connection_1.default.query(query);
        return {
            success: true,
            message: result
        };
    });
}
/**
 * 🧹 Limpa todos os pedidos e libera as mesas.
 *
 * 📌 Regras de negócio:
 * - Marca todos os registros da `tableped` como deletados (`D_E_L_E_T_ = '*'`).
 * - Define `t2 = 0` em todas as mesas, indicando que estão livres.
 *
 * ⚠️ IMPORTANTE:
 * - Função destinada a ambiente de desenvolvimento ou correção de falhas em produção.
 * - Não deve ser usada em ambiente produtivo sem confirmação.
 *
 * @returns Status da operação de limpeza
 */
function cleanTablePed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [cleanPed] = yield connection_1.default.query("UPDATE tableped SET D_E_L_E_T_ = '*'");
            const [liberaMesa] = yield connection_1.default.query("UPDATE tables SET t2 = 0");
            return {
                success: true,
                message: "Mesas liberadas com sucesso"
            };
        }
        catch (error) {
            return {
                success: false,
                error: error
            };
        }
    });
}
exports.default = {
    allTables,
    insertTable,
    deletTable,
    insertTablePed,
    pedTable,
    cleanTablePed
};
