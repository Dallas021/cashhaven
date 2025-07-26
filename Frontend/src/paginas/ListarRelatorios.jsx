import { useState, useEffect } from "react";
import Relatorio from "../componentes/Relatorio";
import apiAcai from "../axios/config";
import styled from "styled-components";
import TicketMedio from "../componentes/TicketMedio";
import Modal from "react-modal";
const DataFiltro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const DataInput = styled.input`
  padding: 8px;
  font-size: 14px;
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  &:focus {
    border-color: #6c2d4e;
  }
`;

const ModalContent = styled.div`
  background: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  color: #6c2d4e;
`;

const Tabela = styled.table`
  width: 95%;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;
  margin: auto;
  margin-top: 70px;

  th,
  td {
    border: none;
    padding: 8px;
    text-align: center;
  }
  td {
    border-bottom: 2px solid #9582a1;
    color: #712976;
    font-weight: 900;
    font-size: 20px;
    cursor: pointer;
  }
  th {
    background-color: #712976;
    color: #fff;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
`;

const ListarRelatorios = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenRel, setModalOpenRel] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const response = await apiAcai.get("/report/precificacao");
        const produtos = response.data.produtos;

        if (produtos.length > 0) {
          const headers = Object.keys(produtos[0]);
          setRelatorios(produtos);
          setHeaders(headers);
        }
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      }
    };

    fetchRelatorios();
  }, []);
  const handleDataChange = (e, setData) => {
    const data = e.target.value;
    setData(data);
  };

  return (
    <div>
      <Tabela>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Relatorio</th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={() => setModalOpen(true)}>
            <td>1</td>
            <td>Precificação - Custo X Lucro </td>
          </tr>
          <tr onClick={() => setModalOpenRel(true)}>
            <td>2</td>
            <td>Ticket Médio</td>
          </tr>
        </tbody>
      </Tabela>

      <Relatorio
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        headers={headers}
        data={relatorios}
      />

      <Modal
        isOpen={modalOpenRel}
        onRequestClose={() => setModalOpenRel(false)}
        style={{
          content: {
            width: "95%",
            height: "80%",
            backgroundColor: "#f8f4f4",
          },
        }}
      >
        <ModalContent>
          <ModalTitle>
            Selecione as Datas para o Relatório de Ticket Médio
          </ModalTitle>

          <DataFiltro>
            <div>
              <label>Data Inicial:</label>
              <DataInput
                type="date"
                value={dataInicial}
                onChange={(e) => handleDataChange(e, setDataInicial)}
              />
            </div>
            <div>
              <label>Data Final:</label>
              <DataInput
                type="date"
                value={dataFinal}
                onChange={(e) => handleDataChange(e, setDataFinal)}
              />
            </div>
          </DataFiltro>

          <TicketMedio dataInicial={dataInicial} dataFinal={dataFinal} />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListarRelatorios;
