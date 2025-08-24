import { lazy, Suspense, useState, useEffect } from "react";
import SideBar from "../componentes/SideBar";
//import { useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Estoque from "./Estoque";
import ListaMesas from "../componentes/ListarMesas";
// import Usuarios from "./RegistroUsuario";
import CadastroCliente from "./CadastroCliente";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import cadeado from "../assets/img/cadeado.png";
import Grafico from "../componentes/Grafico";
import Relatorio from "../componentes/Relatorio";
import ListarRelatorios from "./ListarRelatorios";
import Mesas from "./CadastroMesas";
import {ForcaAbertura} from "../componentes/ForcaAbertura"
//import { WebSocketContext } from "../context/WebSocketContext";
//import QRCode from "react-qr-code";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Flex = styled.div`
  display: flex;
`;

// const MessagesContainer = styled.div`
//   padding: 10px;
//   border-top: 1px solid #ccc;
// `;

const PesquisaCash = lazy(() => import("./PesquisaCash"));
const RegistroUsuario = lazy(() => import("./RegistroUsuario"));
const Parametros = lazy(() => import("./Parametros"));

const Fundo = styled.div``;

const variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const Home = () => {
  const [ativarComponente, setAtivarComponente] = useState("Grafico");
  const [isParamActive, setIsParamActive] = useState(false);
  const [tablefunction, setTablefunction] = useState("");
  const [dadosCaixa, setDadosCaixa] = useState("");

  const [dataHora, setDataHora] = useState(new Date());
  const [dinheiro, setDinheiro] = useState("");
  const [modalDadoCaixa, setModalDadosCaixa] = useState(false);
  //const { messages } = useContext(WebSocketContext);

  const fecharModalDadosCaixa = () => {
    setModalDadosCaixa(false);
  };
  const cliqueMenu = (componenteNome) => {
    setAtivarComponente(componenteNome);
  };

  const userData = JSON.parse(localStorage.getItem("user"));
  const { user } = userData || {};
  const data = dataHora.toLocaleDateString();

  useEffect(() => {
    const carregarParametros = async () => {
      try {
        const res = await apiAcai.get("/param/all");
        setTablefunction(res.data.message[3].bit);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarParametros();
  }, []);

  useEffect(() => {
    const execultadoParametro = async () => {
      if (tablefunction === 0) {
        setIsParamActive(true);
      }
    };
    execultadoParametro();
  }, [tablefunction]);
  const renderizaComponente = () => {
    switch (ativarComponente) {
      case "PesquisaCash":
        return <PesquisaCash />;
      case "Usuarios":
        return <CadastroCliente />;
      case "Clientes":
        return <RegistroUsuario />;
      case "Parametros":
        return <Parametros />;
      case "Estoque":
        return <Estoque />;
      case "Relatorio":
        return <ListarRelatorios />;
      case "Grafico":
        return <Grafico />;
      case "Mesas":
        return <Mesas />;
      default:
        return <h1>Bem-vindo! Selecione uma opção no menu.</h1>;
    }
  };

  const handleClick = (value) => {
    if (value === "." && dinheiro.includes(".")) return;

    setDinheiro((prev) => prev + value);
  };

  const handleClear = () => {
    setDinheiro((prev) => prev.slice(0, -1));
  };


  //Confirma abertura da calculadora
  useEffect(() => {
    const carregarDadosDoCaixa = async () => {
      const abrirCaixa = {
      dinheiro: parseFloat(dinheiro),
      user_cx: user && user.id,
    };
      try {
        const res = await apiAcai.get(`/cx/validate?user_cx=${user.id}`);
        const dados = res.data.s0;
        const mensagem = res.data.message;
        setDadosCaixa(dados);
        if (dados == 0)   {
          setModalDadosCaixa(true);
        } else if (dados == 3) {
          ForcaAbertura(async () => {
          await apiAcai.post("/cx/forceopen", abrirCaixa);
        }, mensagem);
        }
      } catch (error) {
        const status = error.response?.data.s1
        if (status == 0) {
           setModalDadosCaixa(true);
        }
        console.log("Erro", error);
      }
    };
    carregarDadosDoCaixa();
  }, []);

  //Confirma a abertura do caixa depois da calculadora 
  const confirmarAberturaCaixa = async (e) => {
    e.preventDefault();
  
    // Define aqui fora para estar disponível no trycatch
    const abrirCaixa = {
      dinheiro: parseFloat(dinheiro),
      user_cx: user && user.id,
    };
  
    try {
      const res = await apiAcai.post("/cx/open", abrirCaixa);
      //window.location.reload();
  
      if (res.status === 200) {
        fecharModalDadosCaixa();
        // toast.success("Abertura do caixa realizada");
      } else if (res.status === 409) {
        toast.error("Este caixa já foi aberto.");
      }
    } catch (error) {
      const status = error.response?.status;
      const mensagem = error.response?.data?.error || "Erro ao abrir o caixa.";
      console.log("errrrr",error.response.data.error)
      if (status === 409) {
        ForcaAbertura(async () => {
          await apiAcai.post("/cx/forceopen", abrirCaixa);
          fecharModalDadosCaixa();
        }, mensagem);
      } else {
        toast.error("Erro inesperado ao abrir o caixa.");
        console.error(error);
      }
    }
  };
  
  useEffect(() => {
    const carregarParametros = async () => {
      try {
        const res = await apiAcai.get("/param/all");
        setTablefunction(res.data.message[3].bit);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarParametros();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Modal
        isOpen={modalDadoCaixa}
        contentLabel="Confirmar Pedido"
        style={{
          content: {
            width: "60%",
            height: "100%",
            margin: "auto",
            border: "8px solid #46295a",
            padding: 0,
          },
        }}
      >
        <div className="modal-mensagem modal-dados">
          <h2>Abertura de caixa</h2>
          <img src={cadeado} className="cadeado-img" />
        </div>
        <div className="linha-cal">
          <h2>
            DIGITE ABAIXO O VALOR DE ABERTURA DO CAIXA NA DATA DE {data}
          </h2>
        </div>
        <div className="calculator">
          <input
            type="text"
            onChange={(e) => {
              const valorSemPrefixo = e.target.value.replace(/[^\d,]/g, "");
              setDinheiro(valorSemPrefixo);
            }}
            value={`R$ ${dinheiro}`}
            className="display"
          />
          <div className="buttons">
            <button className="btn-cal" onClick={() => handleClick("7")}>
              7
            </button>
            <button className="btn-cal" onClick={() => handleClick("8")}>
              8
            </button>
            <button className="btn-cal" onClick={() => handleClick("9")}>
              9
            </button>
            <button className="btn-cal" onClick={() => handleClick("4")}>
              4
            </button>
            <button className="btn-cal" onClick={() => handleClick("5")}>
              5
            </button>
            <button className="btn-cal" onClick={() => handleClick("6")}>
              6
            </button>
            <button className="btn-cal" onClick={() => handleClick("1")}>
              1
            </button>
            <button className="btn-cal" onClick={() => handleClick("2")}>
              2
            </button>
            <button className="btn-cal" onClick={() => handleClick("3")}>
              3
            </button>
            <button className="btn-cal" onClick={() => handleClick("0")}>
              0
            </button>
            <button className="btn-cal" onClick={() => handleClick(",")}>
              ,
            </button>
            <button className="btn-cal" onClick={handleClear}>
              Del
            </button>
          </div>
        </div>

        <div className="btn-modal-fecha">
          <button className="dados-btn" onClick={confirmarAberturaCaixa}>
            Abrir
          </button>
        </div>
        <div className="rodape-fechamento">
          <h2>Por favor adicione o valor de abertura do caixa </h2>
        </div>
      </Modal>
      <Flex>
        <SideBar onMenuClick={cliqueMenu}></SideBar>
        <Fundo>
          <AnimatePresence mode="wait">
            <motion.div
              key={ativarComponente}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Suspense fallback={<div>Carregando...</div>}>
                {renderizaComponente()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </Fundo>
        {!isParamActive && <ListaMesas />}
      </Flex>
    </>
  );
};

export default Home;
