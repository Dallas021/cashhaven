import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import apiAcai from "../axios/config";
import { toast } from "react-toastify";
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    select{
    margin: 0;
    }
    
  }
`;

const Form = styled.div`
  background: #fff;
  border-radius: 0 0 10px 10px;

  gap: 1.5rem;

  input {
    padding: 0.5rem;
    border: 1px solid #73287d;
    border-radius: 8px;
    font-size: 16px;
    color: #73287d;
  }

  label {
    font-weight: bold;
    color: #73287d;
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  border: 2px solid #73287d;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #73287d;
`;

const Label = styled.label`
  margin-top: 1rem;
  font-weight: bold;
  color: #73287d;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  margin-left: 0px
  margin-top: 0.3rem;
  border: 1px solid #73287d;
  border-radius: 8px;
  font-size: 16px;
`;

const ImpressoraLista = styled.ul`
  margin-top: 1rem;
  list-style: none;
  padding: 0;
`;

const ImpressoraItem = styled.li`
  padding: 0.5rem;
  margin-bottom: 0.3rem;
  background: #f0f0f0;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveBtn = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  background-color: ${(props) =>
    props.primary ? "#73287d" : props.cancel ? "#aaa" : "#a558c6"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`;

const Linha = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;
const ContainerBut = styled.div`
     display: flex;
    justify-content: space-evenly;
`;

const ModalEdicaoImpressora = ({ fechar  }) => {
    const [ips, setIps] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [selectedIP, setSelectedIP] = useState("");
    const [selectedModelo, setSelectedModelo] = useState("");
    const [impressoras, setImpressoras] = useState([]);
    const [novaImpressora, setNovaImpressora] = useState("");
    const [novoIP, setNovoIP] = useState("");
    const [impressorasSalvas, setImpressorasSalvas] = useState([]);
    const [impressoraSelecionada, setImpressoraSelecionada] = useState("");
    const [adicionando, setAdicionando] = useState(false);

    useEffect(() => {
        const buscarDados = async () => {
          try {
            const res = await apiAcai.get("/imp/all");
            setIps(res.data.ips || []);
            setModelos(res.data.modelos || []);
            setImpressorasSalvas(res.data.message || []);
          } catch (error) {
            console.error("Erro ao buscar dados:", error);
          }
        };
        buscarDados();
      }, []);

      const CriarImpressora = async () => {
        try {
          const dados = {
            ip: novoIP,
            model: novaImpressora,
          };
          const res = await apiAcai.post("/imp/register", dados);
          console.log(res)

        } catch (error) {
          console.error("Erro ao cadastrar impressora:", error);
        }
      };

      const modiificarImpressora = async () => {
        try {
          const dados = {
            id: impressoraSelecionada,
          };
          const res = await apiAcai.put("/imp/primary/salved", dados);
          if (res.status === 200) {
            toast.success("Impressora cadastrada com sucesso!");
            setTimeout(() => {
              window.location.reload();
            }, 2000); 
          }

        } catch (error) {
          console.error("Erro ao cadastrar impressora:", error);
        }
      };

      useEffect(() => {
        const buscarDados = async () => {
          try {
            const res = await apiAcai.get("/imp/all/models");
            setModelos(res.data.message || []);
            console.log(res.data.message,"modelos")
          } catch (error) {
            console.error("Erro ao buscar dados:", error);
          }
        };
        buscarDados();
      }, []);
    

  return (
    <>
     <GlobalStyle />
    <ModalOverlay>
      <ModalContainer>
        <Title>Configurar Impressoras</Title>

        {!adicionando ? (
        <>
            <Linha>
              <label>Selecionar Impressora</label>
              <Select
                value={impressoraSelecionada}
                onChange={(e) => setImpressoraSelecionada(e.target.value)}
              >
                <option value="">Selecione uma</option>
                {impressorasSalvas.map((imp) => (
                  <option key={imp.id} value={imp.id}>
                    {imp.ip} - {imp.id_model} - {imp.status === "1" ? "Ativa" : "Inativa"}
                  </option>
                ))}
              </Select>
            </Linha>

          <ContainerBut>
            <Button onClick={() => modiificarImpressora()}> Salvar</Button>
            <Button onClick={() => setAdicionando(true)}>Adicionar Impressora</Button>
            <Button onClick={fechar}> Cancelar</Button>
          </ContainerBut>
        </>
      ) : (
        <>
        <Form>
          <Linha>
            <label>IP</label>
            <input
              value={novoIP}
              onChange={(e) => setNovoIP(e.target.value)}
            />
          </Linha>
          <Linha>
          <label>Modelo</label>
          <Select
            value={novaImpressora}
            onChange={(e) => setNovaImpressora(Number(e.target.value))}
            >
            <option value="">Selecione uma</option>
            {modelos.map((imp) => (
                <option key={imp.id} value={imp.id}>
                {imp.ref}
                </option>
            ))}
        </Select>
            </Linha>
          </Form>
          <ButtonGroup>
            <Button onClick={() => CriarImpressora()}>Salvar Impressora</Button>
            <Button onClick={() => setAdicionando(false)}>Voltar</Button>
          </ButtonGroup>
        </>
      )}
      </ModalContainer>
    </ModalOverlay>
    </>
  );
};

export default ModalEdicaoImpressora;
