import pool from "../database/connection";
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';


async function allUser() {
    const query = "SELECT id, nome, user as usuario FROM user WHERE D_E_L_E_T_ IS NULL OR D_E_L_E_T_ = '' ";

    const [result] = await pool.query(query);

    console.log(result)

    return {
        success: true,
        message: result
    }
}

async function dellUser(id: number) {
    const query = "UPDATE user SET D_E_L_E_T_ = '*' WHERE id = ?";

    try {
        const [result]: [ResultSetHeader, any[]] = await pool.query(query, [id]);

        if (result.affectedRows > 0) {
            return {
                success: true,
                message: ["Usuário do sistema excluído com sucesso"]
            };
        } else {
            return {
                success: false,
                message: ["Nenhum usuário encontrado com o ID fornecido"]
            };
        }
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return {
            success: false,
            message: ["Erro ao excluir usuário"]
        };
    }
}

async function editUser(nome: string, cargo: string, adm: number, senha: string, user: string, id: number) {
    try {
        const hashedSenha = await bcrypt.hash(senha, 10);

        const query = "UPDATE user SET nome = ?, cargo = ?, adm = ?, senha = ?, user = ? WHERE id = ?";

        const [result]: any = await pool.query(query, [nome, cargo, adm, hashedSenha, user, id]);

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Nenhum usuário foi alterado. Verifique se o ID informado é válido."
            };
        }

        return {
            success: true,
            message: "Usuário alterado com sucesso"
        };
    } catch (error) {
        console.error("Erro ao alterar usuário:", error);
        return {
            success: false,
            error: error
        };
    }
}


export default {
    allUser,
    dellUser,
    editUser
}