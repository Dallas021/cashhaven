import pool from "../database/connection";
import { RowDataPacket } from "mysql2";

interface ParametroUpdate {
    valor: number;
    bit: number;
    id: number;
}


async function allParams() {
    const query = "SELECT id, name as parametro, value as valor, bit FROM sys";

    const [result] = await pool.query(query);

    return {
        success: true,
        message: result
    }
}

async function updateParams(params: ParametroUpdate[]) {
    const query = "UPDATE sys SET value = ?, bit = ? WHERE id = ?";

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const { valor, bit, id } of params) {
            console.log("Query", query);
            console.log("Valores:   valor: ",valor,"BIT: ",bit,"ID: ",id)
            await connection.query(query, [valor, bit, id]);
        }

        await connection.commit();

        return {
            success: true,
            message: ["Parâmetros atualizados com sucesso"]
        };
    } catch (error) {
        await connection.rollback();

        return {
            success: false,
            message: ["Erro ao atualizar parâmetros"]
        };
    } finally {
        connection.release();
    }
}

async function whatsappServer() {
    const [whatsapp] = await pool.query<RowDataPacket[]>("SELECT bit FROM sys WHERE id = 12")
    const whatsappServer = whatsapp[0].bit;

    return {
        bit: whatsappServer
    }
}

export default {
    allParams,
    updateParams,
    whatsappServer
}
