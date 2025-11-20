import pool from "../database/connection";
import { sendWhatsappMessage } from "../utils/wpp/config";

declare global {
    var success: any
}

async function allClient() {
    const query = "SELECT id, cpf, tel as telefone, name as nome FROM client WHERE D_E_L_E_T_ IS NULL OR D_E_L_E_T_ = ''";

    const [result] = await pool.query(query);

    return {
        success: true,
        message: result
    }
}

async function serachClient(uid: string) {
   try {
   
      const query = "SELECT id, name as nome, cpf, point as cashback FROM client WHERE cpf = ?";

      const [result]: [any[], any[]] = await pool.query(query, [uid]);
  
      if (result.length === 0) {
          return {
              success: true,
              message: ["NÃ£o existe cliente cadastrado com esse cpf"]
          }
      }
  
      return {
          success: true,
          message: result
      }
   
   } catch (error) {
   
     console.error("erro", error)
     
     return {
     
       success: false,
       message: error
     
     }
   
   }
}

async function serachClientById(uid: string) {
    const query = "SELECT id, name as nome, cpf, point as cashback FROM client WHERE id = ?";

    const [result]: [any[], any[]] = await pool.query(query, [uid]);

    if (result.length === 0) {
        return {
            success: true,
            message: ["Não existe cliente cadastrado com esse cpf"]
        }
    }

    return {
        success: true,
        message: result
    }
}

async function updateClient(id: number, nome: string, telefone: string, cpf: string) {
    try {
        const query = "UPDATE client SET name = ?, tel = ?, cpf = ? WHERE id = ?";

        const [result] = await pool.query(query, [nome, telefone, cpf, id])

        return {
            success: true,
            message: ["Informações do cliente atualizadas com sucesso"]
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: error
        }
    }
}

async function clientCreate(cpf: string, name: string, tel: string) {
    const query = "INSERT INTO client (cpf, name, tel, point) VALUES (?, ?, ?, 0)";
    let venomErrorStatus = null;

    try {
        const [result]: any = await pool.query(query, [cpf, name, tel]);

        const querySdmin = "SELECT value FROM sys WHERE id = 3";
        const [resultSdmin]: any = await pool.query(querySdmin);
        const sdmin = resultSdmin[0].value;

        if (result.affectedRows === 1) {

            const tele = `55${tel}`; 
            const message = `
🌟 Bem-vindo à Toca do Açaí! 🌟

Ficamos muito felizes em ter você como cliente. Aqui, além de saborear o melhor açaí da região, você acumula *cashback* em todas as suas compras!

💰 Como funciona o Cashback?
A cada compra que você fizer, você vai acumular um saldo de cashback. Quando esse saldo atingir R$ ${sdmin} ou mais, você poderá utilizá-lo como desconto nas suas próximas compras!

🍧 Não perca a oportunidade de aproveitar ainda mais nossos deliciosos açaís com descontos exclusivos.

Fique à vontade para aproveitar todos os benefícios e continue saboreando o melhor do açaí! 😋
`;

            await sendWhatsappMessage(tele, message);

            return {
                success: true,
                message: ["Cliente criado com sucesso"],
                venomStatus: venomErrorStatus
                    ? ["Atenção: " + venomErrorStatus]
                    : ["Mensagem enviada com sucesso"],
            };
        } else {
            return {
                success: false,
                message: ["Erro ao criar cliente no banco de dados"],
            };
        }
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                message: ["Cliente já cadastrado"],
            };
        }

        throw error;
    }
}

async function deleteClient(uid:number) {
    const deleteQuery = "UPDATE client SET D_E_L_E_T_ = '*' WHERE id = ?";
    const [result] = await pool.query(deleteQuery, [uid]);

    return {
        success: true,
        message: ["Cliente excluído com sucesso"]
    }
}

export default {
    allClient,
    serachClient,
    updateClient,
    clientCreate,
    deleteClient,
    serachClientById
}
