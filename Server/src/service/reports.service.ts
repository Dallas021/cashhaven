import pool from "../database/connection";
import { RowDataPacket } from "mysql2";


/**
 * Consulta o fechamento diário do caixa para um operador específico.
 * 
 * Regras de negócio:
 * - Busca a sangria do dia atual para o operador (se houver).
 * - Consulta os valores totais das vendas do dia, separadas por forma de pagamento (débito, crédito, pix, dinheiro).
 * - Obtém o saldo inicial do caixa para o operador no dia.
 * - Calcula o total de vendas e o total em caixa considerando se houve sangria.
 * - Retorna um resumo financeiro do dia para o operador.
 * 
 * @param opcx - ID do operador/caixa
 * @returns objeto com valores formatados e resumo financeiro
 */

async function relDiario(opcx: number) {
    const [sangria] = await pool.query<RowDataPacket[]>("SELECT sd_new FROM withdrawing WHERE user_cx = ? AND date = curdate()", [opcx])
    console.log("Operador:", opcx);
    console.log("Sangria:", sangria);
    let Sangria = 0;

    if (sangria.length > 0 && sangria[0].sd_new != null) {
        Sangria = parseFloat(sangria[0].sd_new);
    } const [valorRetirada] = await pool.query<RowDataPacket[]>("SELECT sang FROM withdrawing WHERE user_cx = ? AND date = curdate()", [opcx])
    let retiradaSangria = "0";
    if (valorRetirada.length > 0 && valorRetirada[0].sang != null) {
        retiradaSangria = valorRetirada[0].sang;
    }


    const [queryDebito] = await pool.query<RowDataPacket[]>(
        `
       SELECT sum(pay.valor_recebido) as debito 
       FROM purchases
       INNER JOIN pay ON pay.pedido = purchases.pedido
       WHERE pay.tipo = 3 and purchases.date = curdate() and purchases.op = ?
        `,
        [opcx]
    );

    const [queryCredito] = await pool.query<RowDataPacket[]>(
        `
       SELECT sum(pay.valor_recebido) as credito 
       FROM purchases
       INNER JOIN pay ON pay.pedido = purchases.pedido
       WHERE pay.tipo = 2 and purchases.date = curdate() and purchases.op = ?
        `,
        [opcx]
    );

    const [queryPix] = await pool.query<RowDataPacket[]>(
        `
       SELECT sum(pay.valor_recebido) as pix 
       FROM purchases
       INNER JOIN pay ON pay.pedido = purchases.pedido
       WHERE pay.tipo = 0 and purchases.date = curdate() and purchases.op = ?
        `,
        [opcx]
    );

    const [queryDinheiro] = await pool.query<RowDataPacket[]>(
        `
       SELECT sum(pay.valor_recebido) - sum(pay.bit) as dinheiro 
       FROM purchases
       INNER JOIN pay ON pay.pedido = purchases.pedido
       WHERE pay.tipo = 1 and purchases.date = curdate() and purchases.op = ?
        `,
        [opcx]
    );

    const [saldo_inicial] = await pool.query<RowDataPacket[]>(
        `
        SELECT dinheiro 
        FROM cx 
        WHERE date = CURDATE() AND bit = 1 AND user_cx = ?;
        `,
        [opcx]
    );

    const saldoInicial = parseFloat(saldo_inicial[0]?.dinheiro ?? "0");
    const debito = parseFloat(queryDebito[0]?.debito ?? "0");
    const credito = parseFloat(queryCredito[0]?.credito ?? "0");
    const pix = parseFloat(queryPix[0]?.pix ?? "0");
    const dinheiro = parseFloat(queryDinheiro[0]?.dinheiro ?? "0");

    const total_vendas = debito + credito + pix + dinheiro;

    let total_caixa;

    if (Sangria > 0) {
        total_caixa = Sangria
    } else {
        total_caixa = saldoInicial + dinheiro
    }

    console.log("let total_caixa: ", total_caixa)
    console.log("let sangria: ", sangria)

    return {
        success: true,
        abertura: saldoInicial.toFixed(2),
        vendas_pix: pix.toFixed(2),
        vendas_credito: credito.toFixed(2),
        vendas_debito: debito.toFixed(2),
        vendas_dinheiro: dinheiro.toFixed(2),
        vendas_total: total_vendas.toFixed(2),
        total_caixa: total_caixa,
        sangria: retiradaSangria
    };
}

/**
 * Verifica o parâmetro de alerta de estoque e retorna a quantidade de produtos com estoque baixo.
 * 
 * Regras de negócio:
 * - Consulta a tabela de parâmetros (sys) para verificar se o alerta está ativo (bit = 1).
 * - Caso ativo, retorna a quantidade de itens cujo saldo disponível (sd) está abaixo ou igual ao valor limite configurado.
 * - Caso desativado, retorna erro indicando que o alerta está desligado.
 */

async function stockAlert() {
    try {
        const [paramStock] = await pool.query<RowDataPacket[]>("SELECT value, bit FROM sys WHERE id = 5");

        if (!paramStock || paramStock.length === 0) {
            return {
                success: false,
                error: "Erro ao buscar parâmetro de estoque"
            };
        }

        const atvParamStock = paramStock[0].bit;
        const valueParamStock = paramStock[0].value;

        if (atvParamStock == 1) {
            const [stock_alert] = await pool.query<RowDataPacket[]>("SELECT COUNT(id) AS estoque FROM stock WHERE sd <= ?", [valueParamStock]);

            if (stock_alert.length == 0) {
                return {
                    success: true,
                    message: 0
                }
            }

            return {
                success: true,
                message: stock_alert
            };
        } else {
            return {
                success: false,
                error: "Parâmetro para alerta de estoque está desativado"
            };
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error
        };
    }
}

/**
 * Retorna a quantidade total de vendas feitas no dia atual.
 * 
 * Regra de negócio:
 * - Considera somente as vendas registradas com a data do dia corrente.
 */

async function vendasDia() {
    const [result] = await pool.query<RowDataPacket[]>("SELECT COUNT(pedido) AS venda_do_dia FROM purchases WHERE date = curdate()");
    const vendasDia = result[0].venda_do_dia || "0";

    return {
        success: true,
        vendas: vendasDia
    }
}

/**
 * Retorna o resumo diário de vendas dos últimos `day` dias.
 * 
 * Regras de negócio:
 * - Agrupa o total de vendas por data (formato dd/mm).
 * - Ordena o resultado por data.
 * - Utilizado para análise histórica e gráficos de vendas.
 * 
 * @param day Quantidade de dias para trás da consulta
 */

async function saleResum(day: number) {
    const [resumoVendas] = await pool.query(`
        SELECT 
            COUNT(pedido) AS vendas, 
            DATE_FORMAT(date, "%d/%m") AS data 
        FROM 
            purchases 
        WHERE 
            date >= CURDATE() - INTERVAL ? DAY 
        GROUP BY 
            DATE_FORMAT(date, "%d/%m")
        ORDER BY 
            DATE_FORMAT(date, "%d/%m");
`, [day]);

    return {
        success: true,
        message: resumoVendas
    }
}

/**
 * Calcula o ticket médio entre duas datas.
 * 
 * Regras de negócio:
 * - Considera o faturamento total (soma dos valores de pedidos pagos).
 * - Conta a quantidade de vendas no período.
 * - Calcula o ticket médio dividindo faturamento pelo número de vendas.
 * - Agrupa resultados por dia.
 * 
 * @param date_init Data inicial no formato YYYY-MM-DD
 * @param date_finnaly Data final no formato YYYY-MM-DD
 */

async function ticketMedio(date_init: string, date_finnaly: string) {
    const query = `
        SELECT 
    DATE_FORMAT(purchases.date, "%d/%m/%Y") AS dia,
    SUM(pay.valor_pedido) AS faturamento,
    COUNT(purchases.pedido) AS vendas,
    (SUM(pay.valor_pedido) / COUNT(purchases.pedido)) AS ticket_medio
    FROM purchases
    INNER JOIN pay ON purchases.pedido = pay.pedido
    WHERE purchases.date BETWEEN ? AND ?
    GROUP BY purchases.date
    ORDER BY purchases.date;
    `;

    const [result] = await pool.query<RowDataPacket[]>(query, [date_init, date_finnaly]);

    return {
        success: true,
        dados: result
    };
}

/**
 * Compara o preço base do açaí com o custo por quilo dos complementos do estoque.
 * 
 * Regras de negócio:
 * - Busca o preço base do açaí (id=1 no estoque).
 * - Busca produtos do tipo “KG” (type=1) para cálculo.
 * - Calcula preço por quilo dos complementos e a margem de ganho em valor e percentual.
 * - Retorna lista de complementos com essas informações para análise de lucro.
 */

async function acaiXcomplementos() {
    const [precoBaseAcai] = await pool.query<RowDataPacket[]>("SELECT p_venda FROM stock WHERE id = 1");
    const preco_base = parseFloat(precoBaseAcai[0]?.p_venda) || 0;

    if (!preco_base) {
        return {
            success: false,
            message: "Preço base do açaí não encontrado."
        };
    }

    const [stock] = await pool.query<RowDataPacket[]>(
        "SELECT stock.product as produto, nsd.new_sd, nsd.p_custo, DATE_FORMAT(nsd.date, '%d/%m/%Y') as data_compra, " +
        "CASE WHEN stock.type = 1 THEN 'KG' WHEN stock.type = 2 THEN 'UN' ELSE 'Outro' END as tipo " +
        "FROM nsd INNER JOIN stock ON stock.id = nsd.productid WHERE stock.type = 1"
    );

    if (stock.length === 0) {
        return {
            success: false,
            message: "Nenhum item de estoque encontrado com type = 1."
        };
    }

    const produtos = stock.map(produto => {
        const sd = parseFloat(produto.new_sd) || 1;
        const p_custo = parseFloat(produto.p_custo) || 0;
        const preco_quilo = parseFloat((p_custo / sd).toFixed(2));
        const ganho_valor = parseFloat((preco_base - preco_quilo).toFixed(2));
        const ganho_porcentagem = preco_quilo !== 0 ? parseFloat(((ganho_valor / preco_quilo) * 100).toFixed(2)) : 0;

        return {
            ...produto,
            preco_quilo,
            ganho_valor,
            ganho_porcentagem
        };
    });


    return {
        success: true,
        produtos: produtos,
        preco_base: preco_base
    };
}

export default {
    stockAlert,
    vendasDia,
    saleResum,
    relDiario,
    ticketMedio,
    acaiXcomplementos
}
