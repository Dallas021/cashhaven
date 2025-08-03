import pool from "../database/connection";
import { RowDataPacket } from "mysql2";
import axios from "axios";
import * as dotenv from 'dotenv'
import nfcService from './nfc.service'

dotenv.config();

interface Produto {
  pedido: number;
  prodno: number;
  valor_unit: number;
  unino: number;
  sta: string;
  userno: number;
  produto_nome: string;
}

interface Pagamento {
  pedido: number;
  tipo: string;
  valor_recebido: number;
  valor_pedido: number;
  cb?: number;
  price_cb?: number;
  bit: number;
}

interface Client {
  pedido: number;
  uid: number;
  cashback: number;
  cpf: string;
  tableid: number;
  op: number
}

interface Order {
  produtos: Produto[];
  pagamentos: Pagamento[];
  clients: Client[];
}

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

async function createOrder(order: Order): Promise<{ success: boolean; message?: string; error?: string; details?: string } | undefined> {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    for (const client of order.clients) {
      if (client.uid !== 0) {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM client WHERE id = ?", [client.uid]);
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

      const [nome_produto] = await connection.query<RowDataPacket[]>("SELECT product FROM stock where id = ?", produto.prodno);
      const produto_nome = nome_produto[0].product;

      await connection.query(sql, values);
    }

    for (const pagamento of order.pagamentos) {

      if (pagamento.bit == null || pagamento.bit == undefined) {
        return {
          success: false,
          error: "Informe o valor de troco"
        }
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

      await connection.query(sqlpay, values2);

      if (pagamento.cb == 1 && pagamento.price_cb !== undefined) {
        for (const client of order.clients) {
          const [resultParam] = await pool.query<RowDataPacket[]>("SELECT value FROM sys WHERE id = 6");
          const sdmin = Number(resultParam[0]?.value ?? 0);

          const [rows] = await pool.query<RowDataPacket[]>("SELECT point FROM client WHERE id = ?", [client.uid]);
          const saldoAtual = Number(rows[0]?.point ?? 0);

          if (saldoAtual < pagamento.price_cb) {
            return { success: false, error: `Saldo insuficiente: saldo atual ${saldoAtual}, necessário ${pagamento.price_cb}` };
          }

          const queryDesconto = "UPDATE client SET point = point - ? WHERE id = ?";
          await pool.query(queryDesconto, [pagamento.price_cb, client.uid]);
        }
      } else if (pagamento.cb === 0) {
        for (const client of order.clients) {
          const [paramPorcentagem] = await pool.query<RowDataPacket[]>("SELECT value FROM sys WHERE id = 2");
          const porcentagem = paramPorcentagem[0]?.value ?? 0;

          const [saldo_atual] = await pool.query<RowDataPacket[]>("SELECT point FROM client WHERE id = ?", [client.uid]);
          const saldoAtual = Number(saldo_atual[0]?.point ?? 0);

          const cashback = Number(((porcentagem / 100) * pagamento.valor_recebido).toFixed(2));
          const novo_saldo = saldoAtual + cashback;

          await pool.query("UPDATE client SET point = ? WHERE id = ?", [novo_saldo, client.uid]);
        }

        const [paramSefaz] = await pool.query<RowDataPacket[]>("SELECT bit FROM sys WHERE id = 9");
        const sefaz = paramSefaz[0].bit;

        console.log("Parâmetro sefaz", sefaz);

        if ((pagamento.tipo == "2" || pagamento.tipo == "3") && sefaz == 1) {
          for (const client of order.clients) {
            try {
              const produtosCliente = order.produtos.filter(produto => produto.pedido === client.pedido);

              const url = client.uid !== 0
                ? await nfcService.trueUid(pagamento, client, produtosCliente)
                : await nfcService.falseUid(pagamento, client, produtosCliente);
            } catch (error) {
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
          await pool.query(query, [client.tableid]);

          const query2 = "UPDATE tableped SET bit = 0 WHERE tableid = ?";
          await pool.query(query2, [client.tableid]);
        }
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }

      await connection.query(sqlClient, values3);
    }

    await connection.commit();
    return { success: true, message: "Pedido enviado com sucesso!" };

  } catch (error: any) {
    console.error("Erro ao inserir pedido:", error);
    if (connection) {
      await connection.rollback();
    }

    if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED' && error.sqlMessage.includes('chk_negativar_saldo')) {
      console.error("Erro de saldo insuficiente detectado:", error.sqlMessage);

      const produtoComErro = order.produtos.find(produto => produto.prodno);
      if (produtoComErro) {
        try {
          const [rows] = await pool.query<RowDataPacket[]>("SELECT sd FROM stock WHERE id = ?", [produtoComErro.prodno]);
          const saldoAtual = rows[0]?.sd;

          return {
            success: false,
            error: `Produto sem estoque. Saldo atual: ${saldoAtual}, saldo de venda: ${produtoComErro.valor_unit}`,
          };
        } catch (saldoError) {
          console.error("Erro ao consultar saldo:", saldoError);
        }
      }
      return { success: false, error: "Produto sem estoque. Saldo insuficiente." };
    }

    return { success: false, error: "Erro ao enviar pedido", details: error.message };
  } finally {
    if (connection) {
      connection.release();
    }
  }
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

async function orderNext() {
  const query = "SELECT MAX(pedido) + 1 AS neworder FROM pedno";
  const [result]: any = await pool.query(query);
  const neworder = result[0]?.neworder ?? 1;

  return {
    success: true,
    pedido: neworder,
  };
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

async function panelNFC(uuid: string, status: string, motivo: string, nfe: string, serie: string, modelo: string, recibo: string, chave: string) {
  const query = "INSERT INTO panel_nfc (uuid, status, motivo, nfe, serie, modelo, recibo, chave) VALUES (?,?,?,?,?,?,?,?)";
  const [result] = await pool.query(query, [uuid, status, motivo, nfe, serie, modelo, recibo, chave]);

  return {
    success: true,
    message: "Retorno do emissor ok",
  };
}

export default {
  createOrder,
  orderNext,
  panelNFC,
};
