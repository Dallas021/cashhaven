import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import apiAcai from "../axios/config";

const ContainerMesas = styled.div`
  width: 300px;
  background-color: #f8e9f5;
  border-left: 1px solid #d4c2d9;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);

  button {
    padding: 5px;
    border-radius: 10px;
    background-color: #73287d;
    cursor: pointer;
    color: #fff;
    margin-bottom: 20px;
    margin-right: 5px;
    text-align: center;
    border: none;

    &:hover {
      background-color: #be5eca;
    }
  }
`;

const Mesa = styled.div`
  border: 1px solid #d4c2d9;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  color: #6c1b73;

  h3 {
    margin: 0 0 10px 0;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const Titulo = styled.h2`
  padding: 5px;
  border-radius: 10px;
  background-color: #73287d;
  cursor: pointer;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;

  &:hover {
    background-color: #be5eca;
  }
`;

const ListaMesas = () => {
  const [exibirLista, setExibirLista] = useState(true);
  const [mesas, setMesas] = useState([]);
  const [mesasFin, setMesasFin] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregandoMesas = async () => {
      try {
        const res = await apiAcai.get("/table/ped/all");
        setMesasFin(res.data.message);
        const mesasAgrupadas = agrupandoMesas(res.data.message);
        console.log(mesasAgrupadas, "grup");
        setMesas(mesasAgrupadas);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoMesas();
  }, []);

  const agrupandoMesas = (dados) => {
    const mesasAgrupadas = dados.reduce((acc, mesa) => {
      const { tableid, valor_total, id_client } = mesa;
      if (acc[tableid]) {
        acc[tableid].subtotal += parseFloat(valor_total);
      } else {
        acc[tableid] = {
          tableid,
          id_client,
          subtotal: parseFloat(valor_total),
          tempo: mesa.tempo,
          atendente: mesa.atendente,
        };
      }

      return acc;
    }, {});

    return Object.values(mesasAgrupadas);
  };

  const alternarVisibilidade = () => {
    setExibirLista(!exibirLista);
  };
  const finalizarPedido = (mesa) => {
    
    navigate("/pdv", {
      state: { mesa, mesasFin, cliente: "bolcao" },
    });
    console.log("teste mesa",mesa, mesasFin, )
  };
  const adicionarProduto = (mesa) => {
    navigate("/pdv", {
      state: { mesa, tipoCliente: "mesa" },
    });
  };

  return (
    <ContainerMesas>
      <Titulo onClick={alternarVisibilidade}>Mesas</Titulo>
      {exibirLista && (
        <>
          {mesas.map((mesa) => (
            <Mesa key={mesa.tableid}>
              <h3>Mesa {mesa.tableid}</h3>
              <p>Tempo: {mesa.tempo}</p>
              <p>Subtotal: R${mesa.subtotal.toFixed(2)}</p>
              <p>Atendente: {mesa.atendente}</p>
              <button onClick={() => finalizarPedido(mesa)}>
                Finalizar Pedido
              </button>
              <button onClick={() => adicionarProduto(mesa)}>
                Adicionar Produto
              </button>
            </Mesa>
          ))}
        </>
      )}
    </ContainerMesas>
  );
};

export default ListaMesas;
