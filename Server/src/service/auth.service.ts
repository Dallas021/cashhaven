import pool from '../database/connection';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;


interface User {
  id: number;
  nome: string;
  usuario: string;
  senha: string;
  cargo?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  expiration?: Date;
  nome?: string;
  id?: number;
  errors?: string[];
  details?: any;
  jwt?: string;
  cargo?: string;
  code?: number 
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: any;
  jwt?: string;
  cargo?: string;
  code?: number 
}

interface RegisterUserData {
  nome: string;
  nome_usuario: string;
  senha: string;
  cargo?: string;
  adm: number
}

async function loginUser(usuario: string, senha: string): Promise<LoginResponse> {
  try {
    const query = `
      SELECT 
        id, 
        UPPER(nome) AS nome, 
        user AS usuario, 
        senha,
        cargo
      FROM user
      WHERE user = ?
    `;
    const values = [usuario];
    const [results] = await pool.query(query, values);

    const users: User[] = results as User[];

    if (users.length === 1) {
      const user = users[0];
      const isPasswordValid = await bcrypt.compare(senha, user.senha);

      if (isPasswordValid) {
        const payload = { id: user.id, usuario: user.usuario };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "12h" });
        const decodedToken = jwt.decode(token) as JwtPayload;
        const expirationDate = new Date(decodedToken.exp! * 1000);

        return {
          success: true,
          token,
          expiration: expirationDate,
          nome: user.nome,
          id: user.id,
          jwt: user.senha,
          cargo: user.cargo
        };
      } else {
        return { success: false, errors: ["Senha incorreta"] };
      }
    } else {
      return { 
         success: false,
         errors: ["Usuário não encontrado"],
         code: 404 
        };
    }
  } catch (error) {
    return { success: false, errors: ["Erro no Banco de Dados"], details: error };
  }
}

async function registerUser(userData: RegisterUserData): Promise<RegisterResponse> {
  try {
    const { nome, nome_usuario, senha, cargo, adm } = userData;
    const hashedSenha = await bcrypt.hash(senha, 10);

    const query = `INSERT INTO user (nome, user, senha, cargo, adm, sys) VALUES (?, ?, ?, ?, ?, 0)`;
    const values = [nome, nome_usuario, hashedSenha, cargo, adm];

    await pool.query(query, values);
    return { success: true, message: "Usuário cadastrado com sucesso" };
  } catch (error) {
    return { success: false, error: "Erro ao cadastrar usuário", details: error };
  }
}

export default {
    loginUser,
    registerUser
}