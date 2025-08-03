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
 * 📦 Verifica o estado atual do caixa para o operador.
 *
 * 📌 Regras de negócio:
 * - Se for ADM (`cx == 1`), permite acesso direto sem validações.
 * - Se **não há movimentação no dia atual**:
 *   - Se o **último caixa do dia anterior** estiver aberto (`bit == 1`), informa que o dia anterior não foi fechado.
 *   - Caso contrário, orienta o operador a abrir o primeiro caixa do dia.
 * - Se houver movimentação hoje:
 *   - Se o caixa estiver aberto por outro operador, bloqueia o acesso e informa o operador atual.
 *   - Caso contrário, permite abertura do caixa.
 *
 * @param cx - ID do operador (usuário)
 * @returns Objeto com status e mensagem sobre a situação do caixa
 */
function getCx(user_cx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const cx = Number(user_cx);
        const [queryDiaAnterior] = yield connection_1.default.query("SELECT bit, DATE_FORMAT(date, '%d/%m/%Y') as date FROM cx WHERE date < CURDATE() ORDER BY date DESC LIMIT 1");
        const diaAnterior = (_b = (_a = queryDiaAnterior[0]) === null || _a === void 0 ? void 0 : _a.bit) !== null && _b !== void 0 ? _b : "dia anterior em aberto";
        const dataAnterior = (_d = (_c = queryDiaAnterior[0]) === null || _c === void 0 ? void 0 : _c.date) !== null && _d !== void 0 ? _d : "sem informações";
        const [diaAtual] = yield connection_1.default.query("SELECT bit FROM cx WHERE date = curdate()");
        const hoje = (_f = (_e = diaAtual[0]) === null || _e === void 0 ? void 0 : _e.bit) !== null && _f !== void 0 ? _f : "sem movimentação";
        if (cx == 1) {
            return {
                success: true,
                message: "Bem vindo, ADM",
                s0: 4
            };
        }
        if (hoje === "sem movimentação") {
            if (diaAnterior === 1 && dataAnterior !== "sem informações") {
                return {
                    success: true,
                    message: `Caixa do dia ${dataAnterior} em aberto`,
                    s0: 3
                };
            }
            else {
                return {
                    success: true,
                    message: "Seja bem vindo ao CashHaven, realize a sua primeira abertura de caixa",
                    s0: 0
                };
            }
        }
        else {
            const [estadoAtualCaixa] = yield connection_1.default.query("SELECT bit, user_cx FROM cx WHERE date = CURDATE() ORDER BY TIMESTAMP(date, time) DESC LIMIT 1");
            const ultimo_operador = (_g = estadoAtualCaixa[0]) === null || _g === void 0 ? void 0 : _g.user_cx;
            const ultimo_estado = (_h = estadoAtualCaixa[0]) === null || _h === void 0 ? void 0 : _h.bit;
            if (cx !== ultimo_operador && ultimo_estado === 1) {
                console.log("let cx: ", user_cx);
                console.log("let ultimo_operador ", ultimo_operador);
                console.log("let ultimo_estado ", ultimo_estado);
                return {
                    success: false,
                    error: `Caixa do operador ${ultimo_operador} já se encontra em aberto, deseja fechar?`,
                    s1: 0
                };
            }
            else if (cx == ultimo_operador && ultimo_estado == 1) {
                return {
                    success: true,
                    message: "Bem vindo de volta ao caixa"
                };
            }
            else {
                return {
                    success: true,
                    message: "É necessário abrir o caixa para logar no sistema",
                    s0: 0
                };
            }
        }
        return {
            success: false,
            error: "Não foi possível validar o caixa",
        };
    });
}
/**
 * 🟢 Tenta abrir um novo caixa para o operador.
 *
 * 📌 Regras de negócio:
 * - Se for ADM (`user_cx == 1`), permite acesso imediato sem registrar abertura.
 * - Se o último caixa anterior estiver fechado, permite abertura de um novo.
 * - Se o último caixa estiver aberto por outro operador, impede nova abertura e retorna erro.
 * - Se o último caixa estiver em aberto pelo mesmo operador, bloqueia reabertura até que seja fechado.
 *
 * @param user_cx - ID do operador que está abrindo o caixa
 * @param dinheiro - Valor inicial em espécie para abertura do caixa
 * @returns Objeto com status e mensagem de sucesso ou erro
 */
function openCx(user_cx, dinheiro) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user_cx == 1) {
            return {
                success: true,
                message: "Bem vindo, ADM",
                s0: 4
            };
        }
        const [queryUltimoUsuario] = yield connection_1.default.query("SELECT bit, user_cx as cxquery FROM cx ORDER BY TIMESTAMP(date, time) DESC LIMIT 1");
        const ultimoRegistro = queryUltimoUsuario[0];
        const ultimoOperador = (ultimoRegistro === null || ultimoRegistro === void 0 ? void 0 : ultimoRegistro.bit) || 0;
        const ultCX = (ultimoRegistro === null || ultimoRegistro === void 0 ? void 0 : ultimoRegistro.cxquery) || 0;
        if (ultCX != user_cx && ultimoOperador == 1) {
            return {
                success: false,
                error: "Caixa já está aberto por outro usuário" + "Ultimo operador: " + ultCX,
                s1: 0,
                code: 409
            };
        }
        else if (ultimoOperador == 1 && (ultCX == user_cx)) {
            return {
                success: false,
                error: "Seu último caixa não foi fechado",
                code: 409
            };
        }
        else if (!ultimoRegistro) {
            const query = "INSERT INTO cx (user_cx, credito, dinheiro, pix, debito, date, time, bit) VALUES (?, 0, ?, 0, 0, curdate(), curtime(), 1)";
            const [result] = yield connection_1.default.query(query, [user_cx, dinheiro]);
            return {
                success: true,
                message: "Caixa aberto com sucesso"
            };
        }
        else {
            const query = "INSERT INTO cx (user_cx, credito, dinheiro, pix, debito, date, time, bit) VALUES (?, 0, ?, 0, 0, curdate(), curtime(), 1)";
            const [result] = yield connection_1.default.query(query, [user_cx, dinheiro]);
            return {
                success: true,
                message: "Caixa aberto com sucesso"
            };
        }
    });
}
/**
 * 🔓 Força a abertura de um novo caixa, mesmo com pendência anterior.
 *
 * 📌 Regras de negócio:
 * - Fecha automaticamente o último caixa em aberto (bit = 1), copiando os valores anteriores.
 * - Em seguida, abre um novo caixa para o operador atual com o valor em espécie informado.
 * - Essa função ignora o controle normal de abertura/fechamento e deve ser usada com cautela.
 *
 * @param user_cx - ID do operador que está abrindo o novo caixa
 * @param dinheiro - Valor em espécie para iniciar o novo caixa
 * @returns Objeto com status e mensagem confirmando a nova abertura
 */
function forceOpenCx(user_cx, dinheiro) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [queryUltimoCaixa] = yield connection_1.default.query("SELECT dinheiro, credito, debito, pix, user_cx FROM cx WHERE date < CURDATE() AND bit = 1 ORDER BY date DESC LIMIT 1");
            if (!queryUltimoCaixa || queryUltimoCaixa.length === 0) {
                return {
                    success: false,
                    error: "Nenhum caixa anterior encontrado para clonar dados.",
                    code: 404
                };
            }
            const ultimoOperador = queryUltimoCaixa[0].user_cx;
            const ultimoSaldoDinheiro = queryUltimoCaixa[0].dinheiro;
            const ultimoSaldoCredito = queryUltimoCaixa[0].credito;
            const ultimoSaldoDebito = queryUltimoCaixa[0].debito;
            const ultimoSaldoPix = queryUltimoCaixa[0].pix;
            const query = "INSERT INTO cx (user_cx, credito, dinheiro, pix, debito, date, time, bit) VALUES (?, ?, ?, ?, ?, curdate(), curtime(), 0)";
            const [result] = yield connection_1.default.query(query, [ultimoOperador, ultimoSaldoCredito, ultimoSaldoDinheiro, ultimoSaldoPix, ultimoSaldoDebito]);
            const newcx = "INSERT INTO cx (user_cx, credito, dinheiro, pix, debito, date, time, bit) VALUES (?, 0, ?, 0, 0, curdate(), curtime(), 1)";
            const [resultNewCx] = yield connection_1.default.query(newcx, [user_cx, dinheiro]);
            return {
                success: true,
                message: "Caixa aberto com sucesso"
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
 * 🛑 Realiza o fechamento do caixa atual.
 *
 * 📌 Regras de negócio:
 * - Insere um novo registro na tabela `cx` com os valores consolidados e `bit = 0`, indicando que o caixa foi fechado.
 * - Registra os totais recebidos por meio de crédito, débito, pix, dinheiro e valor de sangria.
 * - Gera uma mensagem de resumo do fechamento contendo o operador e os valores.
 * - Verifica os parâmetros de sistema:
 *   - `sys.id = 12`: habilita/desabilita a integração com WhatsApp (bit = 1 para habilitado).
 *   - `sys.id = 14`: controla o envio automático da mensagem de fechamento (bit = 1) e o número de destino (ref).
 * - Caso a integração com WhatsApp esteja ativa e configurada corretamente, envia a mensagem para o número definido.
 *
 * @param user_cx - ID do operador que está realizando o fechamento do caixa
 * @param credito - Total em cartão de crédito no fechamento
 * @param debito - Total em cartão de débito no fechamento
 * @param pix - Total em pagamentos via PIX no fechamento
 * @param dinheiro - Total em dinheiro no fechamento
 * @param fcx - Total consolidado em caixa (soma de todas as entradas - sangria)
 * @param vsang - Valor total de sangrias realizadas antes do fechamento
 *
 * @returns Um objeto contendo:
 *  - `success`: Indica se o fechamento foi realizado com sucesso
 *  - `message`: Mensagem principal de confirmação
 *  - `aviso`: Status da tentativa de envio via WhatsApp (ou motivo pelo qual não foi enviado)
 */
function closeCx(user_cx, credito, debito, pix, dinheiro, fcx, vsang, trnc, abertura) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "INSERT INTO cx (user_cx, credito, debito, pix, dinheiro, fcx, vsang, date, time, bit) VALUES (?,?,?,?,?,?,?,curdate(),curtime(),0);";
        const [result] = yield connection_1.default.query(query, [user_cx, credito, debito, pix, dinheiro, fcx, vsang]);
        const [nomeOperador] = yield connection_1.default.query("SELECT nome FROM user WHERE id = ?", [user_cx]);
        const [verifyParams] = yield connection_1.default.query("SELECT bit, ref FROM sys WHERE id = 14");
        const [paramwpp] = yield connection_1.default.query("SELECT bit FROM sys WHERE id = 12");
        const bit = verifyParams[0].bit;
        const ref = verifyParams[0].ref || "999";
        const wpp = paramwpp[0].bit || 0;
        const operador = nomeOperador[0].nome || "Verifique com Admin";
        const agora = new Date();
        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const ano = agora.getFullYear();
        const hora = String(agora.getHours()).padStart(2, '0');
        const minuto = String(agora.getMinutes()).padStart(2, '0');
        const dataHoraFormatada = `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
        const msg = `
📦 Fechamento de Caixa
👤 Operador: ${operador}
🕔 Data/Hora: ${dataHoraFormatada}
💵 Abertura: R$ ${abertura}
💳 Crédito:  R$ ${credito}
🏦 Débito:   R$ ${debito}
💸 PIX:      R$ ${pix}
💵 Dinheiro: R$ ${dinheiro}
🔻 Sangria:  R$ ${vsang}

🧮 Total em Caixa: R$ ${fcx}
🧮 Total recebido nesse caixa: R$ ${trnc} 
    `;
        let mensagem = "";
        if (wpp == 0) {
            mensagem = "Parâmetro de integração com whatsapp desativado";
        }
        else if (bit == 0) {
            mensagem = "Parâmetro de enviar fechamento via whatsapp desativado";
        }
        else if (bit == 1 && ref == 999) {
            mensagem = "Parâmetro de enviar fechamento via whatsapp ativado porém número de envio não cadastrado";
        }
        else {
            const venomClient = (0, config_1.getVenomClient)();
            const venomError = (0, config_1.getVenomError)();
            if (!venomClient) {
                return {
                    success: false,
                    msg: ["Venom Client não está disponível no momento."],
                };
            }
            const tele = `55${ref}@c.us`;
            yield venomClient.sendText(tele, msg);
            mensagem = "Envio do fechamento enviado para o whatsapp";
        }
        return {
            success: true,
            message: "Caixa fechado com sucesso",
            aviso: mensagem
        };
    });
}
/**
 * 💸 Realiza uma sangria (retirada parcial de dinheiro do caixa).
 *
 * 📌 Regras de negócio:
 * - Verifica se o valor da sangria é menor ou igual ao saldo atual em espécie.
 * - Se for maior, bloqueia a operação e retorna erro.
 * - Se for válido, registra a sangria na tabela e calcula o novo saldo restante.
 *
 * @param user_cx - ID do operador que está realizando a sangria
 * @param sang - Valor da sangria (retirada)
 * @param sd_old - Saldo em espécie disponível antes da sangria
 * @returns Objeto com status e mensagem de sucesso ou erro
 */
// SD_OLD ESTÁ SENDO ENVIADO INCORRETO (VALOR DE VENDAS), PRECISA VIM DA VARIAVEL TOTAL CAIXA
function withdrawing(user_cx, sang, sd_old) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "INSERT INTO withdrawing (user_cx, sang, sd_old, sd_new, date, time) VALUES (?,?,?,?,curdate(), curtime())";
        const sangNum = Number(sang);
        const sdOldNum = Number(sd_old);
        if (isNaN(sangNum) || isNaN(sdOldNum)) {
            return {
                success: false,
                error: "Valores inválidos enviados para sangria"
            };
        }
        const sangria = Number(sangNum.toFixed(2));
        const saldoAnterior = Number(sdOldNum.toFixed(2));
        const sd_new = saldoAnterior - sangria;
        console.log("Sangria: ", sang);
        console.log("Valor anterior: ", sd_old);
        if (sangria > saldoAnterior) {
            return {
                success: false,
                error: "Saldo insuficiente",
                code: "SALDO_INSUFICIENTE"
            };
        }
        if (user_cx == 1) {
            return {
                success: false,
                error: "Administrador não pode realizar sangria no caixa",
                code: "ADMIN_SANGRIA"
            };
        }
        const [result] = yield connection_1.default.query(query, [user_cx, sang, sd_old, sd_new]);
        return {
            success: true,
            message: "Sangria realizada com sucesso"
        };
    });
}
exports.default = {
    getCx,
    openCx,
    forceOpenCx,
    closeCx,
    withdrawing
};
