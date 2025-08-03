import pool from "../database/connection";
import { RowDataPacket } from "mysql2";

async function allStock() {
    const query = "SELECT id, product as produto, sd as saldo, p_custo as preco_custo, p_venda as preco_venda, forn as ultimo_fonecedor FROM stock WHERE D_E_L_E_T_ IS NULL OR D_E_L_E_T_ = ''";

    const [result]: [any[], any[]] = await pool.query(query);

    if (result.length === 0) {
        return {
            success: true,
            message: ["Nenhum produto encontrado"]
        }
    }

    return {
        success: true,
        message: result
    }
}

async function insertStock(produto: string, compra: number, venda: number, fornecedor: string, saldo: number) {
    const validations = [
        { condition: !fornecedor, error: "É necessário informar o fornecedor" },
        { condition: !produto, error: "É necessário informar o nome do produto" },
        { condition: compra <= 0, error: "O preço de compra deve ser maior que zero" },
        { condition: venda <= 0, error: "O preço de venda deve ser maior que zero" },
        { condition: saldo < 0, error: "O saldo não pode ser negativo" },
    ];

    for (const validation of validations) {
        if (validation.condition) {
            return {
                success: false,
                error: [validation.error],
            };
        }
    }

    const query = "INSERT INTO stock (product, p_custo, p_venda, forn, sd) VALUES (?,?,?,?,?)";
    const [result] = await pool.query(query, [produto, compra, venda, fornecedor, saldo]);
    const [junt] = await pool.query<RowDataPacket[]>("SELECT id FROM stock WHERE product = ? AND p_custo = ?", [produto, compra]);
    const id = junt[0].id;
    const query2 = "INSERT INTO nsd (productid, old_sd, p_custo, forn, new_sd, date, time) VALUES (?,0,?,?,?,curdate(),curtime());";
    const [insertNSD] = await pool.query(query2, [id, compra, fornecedor, saldo]);

    return {
        success: true,
        message: ["Produto cadastrado com sucesso"],
    };
}

async function insertSD(id: number, saldo: number, fornecedor: string, compra: number) {
    const queryOldSd = "SELECT sd FROM stock WHERE id = ?";
    
    const [resultOldSd] = await pool.query<RowDataPacket[]>(queryOldSd, [id]);
    
    if (resultOldSd.length === 0) {
        throw new Error("Produto não encontrado");
    }
    
    const oldSD = resultOldSd[0].sd;

    const query = "INSERT INTO nsd (productid, old_sd, new_sd, forn, p_custo, date, time) VALUES (?,?,?,?,?,curdate(), curtime())";
    await pool.query(query, [id, oldSD, saldo, fornecedor, compra]);

    return {
        success: true,
        message: ["Saldo inserido com sucesso"]
    };
}

async function modifyProduct(nome:string, venda:number, id:number) {
    const query = "UPDATE stock SET product = ?, p_venda = ? WHERE id = ?"
    
    const [result] = await pool.query(query, [nome, venda, id]);

    return {
        success: true,
        message: ["Produto atualizado com sucesso"]
    }
}

async function deleteProduct(pid:number) {
    const query = "UPDATE stock SET D_E_L_E_T_ = '*' WHERE id = ?";
    const [result] = await pool.query(query, [pid]);

    return {
        success: true,
        message: ["Produto excluído com sucesso"]
    }
}

async function serachID(pid:number) {
    const query = "SELECT * FROM stock WHERE id = ?";
    const [result] = await pool.query(query, [pid]);
    
    return {
        success: true,
        message: result
    }
}

async function serachName(name:string) {
    const query = "SELECT * FROM stock WHERE product LIKE ?";
    const [result] = await pool.query(query, [`%${name}%`]);
    
    return {
        success: true,
        message: result
    }
}

export default {
    allStock,
    insertStock,
    insertSD,
    modifyProduct,
    deleteProduct,
    serachID,
    serachName
}