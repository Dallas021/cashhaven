import Modal from "react-modal";
import styled from "styled-components";
import { useState } from "react";
import { usuarioSchema } from "../utils/validador.js";
import * as yup from "yup";
import { toast } from "react-toastify";
import apiAcai from "../axios/config.js";

const ModalCadastroProduto = styled.div`
  background-color: #73287d;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  gap: 35%;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;

  h2 {
    font-size: 25px;
    color: #f3eef7;
    text-align: center;
    margin-left: 10px;
    font-weight: 900;
    cursor: pointer;
  }
`;

const Form = styled.div`
  display: flex;

  input,
  label {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #73287d;
    font-weight: 700;
    font-size: 20px;
  }
  input {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #73287d;
  }
`;

const Form1 = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButaoEnvioUsuario = styled.div`
  display: flex;
  margin-top: 1.5%;
  justify-content: center;

  input {
    background-color: #73287d;
    color: #f3eef7;
    padding: 15px 50px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
  }

  input:hover {
    background-color: #8b43bb;
    border: none;
    transition: 1s;
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #712976;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ModalCadastroUsuario = ({ isOpen, onRequestClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChangeCpf = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatado = value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    setCpf(formatado);
  };

  const cadastrarUsuario = async (e) => {
    e.preventDefault();

    if (!name.trim() || !cpf.trim() || !telefone.trim()) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    const dados = {
      name,
      cpf: cpf.replace(/\D/g, ""),
      telefone,
    };

    setEnviando(true);

    try {
      await usuarioSchema.validate(dados, { abortEarly: false });
      const res = await apiAcai.post("/client/create", dados);
      if (res.status === 200) {
        toast.success("Cliente cadastrado com sucesso!");
        window.location.reload();
        navigate("/home");
        fecharModal();
        setName("");
        setCpf("");
        setTelefone("");
        onRequestClose(); 
        if (onSuccess) onSuccess(); 
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => toast.error(err.message));
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cadastro de Cliente"
      style={{
        content: {
          borderRadius: "15px",
          maxWidth: "60%",
          height:"50%",
          margin: "auto",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 0 10px rgb(0 0 0 / 67%)",
        },
      }}
    >
      <ModalCadastroProduto>
        <h2>Cadastro de Cliente</h2>
      </ModalCadastroProduto>
      <form onSubmit={cadastrarUsuario}>
        <Form>
          <Form1>
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form1>
          <Form1>
            <label>CPF</label>
            <input
              type="text"
              placeholder="CPF do cliente"
              value={cpf}
              onChange={handleChangeCpf}
            />
          </Form1>
        </Form>
        <Form>
          <Form1>
            <label>Telefone</label>
            <input
              type="text"
              placeholder="Telefone do cliente"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </Form1>
        </Form>
        <ButaoEnvioUsuario>
          {enviando ? (
            <Spinner />
          ) : (
            <input type="submit" value="Cadastrar cliente" />
          )}
        </ButaoEnvioUsuario>
      </form>
    </Modal>
  );
};

export default ModalCadastroUsuario;
