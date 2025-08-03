import pool from '../database/connection';
import { RowDataPacket } from "mysql2";

interface PedidoItem {
  codigo: string;
  unidade: string;
  descricao: string;
  valor: string;
}

async function cupom(PedidoItem: [], hash: string, imp: string) {

}

export async function allImp() {
  const [result] = await pool.query<RowDataPacket[]>(`
    SELECT 
      imp.id as id,
      imp.ip as ip,
      impm.ref as id_model ,
      imp.bit as status
    FROM
      imp
    LEFT JOIN
      imp_model impm ON imp.id_model = impm.id`);

  if (result == null || result == undefined) {
    return {
      success: false,
      error: "Nenhuma impressora cadastrada"
    }
  }

  return {
    success: true,
    message: result
  }
};

async function registerImp(ip: string, model: number) {
  try {
    const [result] = await pool.query('INSERT INTO imp (ip, id_model) VALUES (?,?)', [ip, model]);

    return {
      success: true,
      message: 'Impressora cadastrada com sucesso'
    }

    if (!result) {
      return {
        success: false,
        error: "Impressora não cadastrada, por favor entrar em contato com administrador do sistema"
      }
    }
  } catch (error: any) {

    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes(`for key 'imp.ip'`)) {
      return {
        success: false,
        error: "IP já cadastrado em outra impressora"
      }
    }

    return {
      success: false,
      error: error
    }
  }
}

async function allModels() {
  const [result] = await pool.query("SELECT * FROM imp_model");

  return {
    success: true,
    message: result
  }
}

async function primaryImp() {
  const [rows]: any = await pool.query("SELECT imp.ip as ip, impm.ref as modelo FROM imp INNER JOIN imp_model impm ON imp.id_model = impm.id WHERE imp.bit = 1 AND imp.D_E_L_E_T_ IS NULL");

  if (rows.length !== 1) {
    return {
      success: false,
      message:
        rows.length === 0
          ? "Nenhuma impressora primária cadastrada"
          : "Mais de uma impressora primária cadastrada",
    };
  }

  return {
    success: true,
    ip: rows[0].ip,
    model: rows[0].modelo
  };
}

async function salvaPrimaryImp(id: number) {
  try {
    const [retiraPrimari] = await pool.query("UPDATE imp SET bit = 0");
    const [newImp] = await pool.query("UPDATE imp SET bit = 1 WHERE id = ?", [id]);

    return {
      success: true,
      message: "Impressora primária atualizada com sucesso"
    }
  } catch (error) {
    return {
      success: false,
      error: "Erro ao cadastrar impreesora primária" 
    }
  }
}


export default {
  registerImp,
  allImp,
  allModels,
  primaryImp,
  salvaPrimaryImp
}