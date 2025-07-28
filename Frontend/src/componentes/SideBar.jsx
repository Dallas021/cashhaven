import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/img/logo.jpg";
import compra from "../assets/img/comprar-online.png";
import estoque from "../assets/img/estoque.png";
import relatorio from "../assets/img/relatorio.png";
import cliente from "../assets/img/cliente.png";
import sair from "../assets/img/sair.png";
import configuracao from "../assets/img/configuracao.png";
import registro from "../assets/img/registro.png";
import { logout, reset } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import sangia from "../assets/img/sangria.png";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config.js";
import dinheiro from "../assets/img/dinheiro.png";
import SetaFechar from "../componentes/SetaFechar.jsx";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Relatorio from "./Relatorio.jsx";
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const FlexContainer = styled.div`
  display: flex;
`;

const SideBarClass = styled.div`
  min-height: 100vh;
  min-width: 250px;
  background-color: #712976;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Container1 = styled.div`
  line-height: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 135px;
  height: 135px;
  border-radius: 50px;
  margin-bottom: 10px;
  cursor: pointer;
`;
const Cofig = styled.div`
  display: flex;
  justify-content: space-between;
  img {
    height: 40px;
    width: 40px;
  }
  p {
    font-size: 15px;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    display: flex;

    flex-direction: column;
    align-items: center;
    color: #fff;
    text-decoration: none;
  }
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SmallImage = styled.img`
  width: 65px;
  height: 65px;
  cursor: pointer;
`;
const Paragraph = styled.p`
  font-size: 21px;
`;

const MainContainer = styled.div`
  opacity: 0.5;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  width: 80%;
`;
const Footer = styled.div`
  margin-top: 20px;
`;
const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #712976;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SideBar = ({ onMenuClick }) => {
  const [isParamActive, setIsParamActive] = useState(false);
  const [cashback, setCashback] = useState("");
  const [modalFechamentoCaixa, setModalFechamentoCaixa] = useState(false);
  const [modalCancelamento, setModalCancelamento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [vendas_credito, setVendas_Credito] = useState("");
  const [vendas_debito, setVendas_Debito] = useState("");
  const [vendas_dinheiro, setVendas_Dinheiro] = useState("");
  const [vendas_pix, setVendas_Pix] = useState("");
  const [abertura, setAbertura] = useState("");
  const [sang, setSang] = useState("");
  //const [sd_old, setSd_old] = useState("");
  const [total_caixa, setTotal_Caixa] = useState("");
  const [valorSangria, setValorSangria] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [vsang, setVsang] = useState("")
  const [fcx, setFcx] = useState("")
  const [vendas_total, setVendas_total] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem("user"));
  const { user, token } = userData || {};

  const abrirModalSangria = () => {
    setValorSangria(true);
  };
  const fecharModalSangria = () => {
    setValorSangria(false);
  };
  const abrirModalFechamentoCaixa = () => {
    setModalFechamentoCaixa(true);
  };
  const fecharModalFechamentoCaixa = () => {
    setModalFechamentoCaixa(false);
  };
  const abrirModalCancelamento = () => {
    setModalCancelamento(true);
  };
  const fecharModalCancelamento = () => {
    setModalCancelamento(false);
  };

  useEffect(() => {
    const carregarParametros = async () => {
      try {
        const res = await apiAcai.get("/param/all");
        console.log("Sucesso", res.data.message[2].bit);
        setCashback(res.data.message[2].bit);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarParametros();
  }, []);
  const botaoLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/");
  };
  useEffect(() => {
    const consultaSaldoDiario = async () => {
      try {
        const res = await apiAcai.get(`/report/diario?user_cx=${user.id}`);
        setVendas_Credito(res.data.vendas_credito);
        setVendas_Debito(res.data.vendas_debito);
        setVendas_Dinheiro(res.data.vendas_dinheiro);
        setVendas_Pix(res.data.vendas_pix);
        setAbertura(res.data.abertura);
        setTotal_Caixa(res.data.total_caixa);
        setVsang(res.data.sangria)
        setFcx(res.data.total_caixa)
        setVendas_total(res.data.vendas_total)
        console.log("re", res.data);
      } catch (error) {
        console(error);
      }
    };
    consultaSaldoDiario();
  }, []);

  useEffect(() => {
    const execultadoParametro = async () => {
      if (cashback === 1) {
        setIsParamActive(true);
        console.log("aq");
      }
    };
    execultadoParametro();
  }, [cashback]);

  const fechamentoCaixa = async (e) => {
    e.preventDefault(e);

    const usuarioFechamento = {
      user_cx: user && user.id,
      credito: vendas_credito,
      debito: vendas_debito,
      pix: vendas_pix,
      dinheiro: vendas_dinheiro,
      vsang: vsang,
      fcx: total_caixa,
      trnc: vendas_total,
      abertura: abertura

    };

    try {
      setEnviando(true);
      const res = await apiAcai.post("/cx/close", usuarioFechamento, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        // fecharModalCancelamento();
        // fecharModalFechamentoCaixa();
      }
    } catch (error) {
      console.log("Erro", error);
    } finally {
      setEnviando(false);
    }
  };
  const handleClick = (e) => {
    fechamentoCaixa(e).then(() => {
      setTimeout(() => {
        botaoLogout(e);
      }, 3000); // atraso de 3 segundos
    });
  };

  const envioSangria = async (e) => {
    e.preventDefault();

    setEnviando(true);
    const usuarioSangria = {
      user_cx: user && user.id,
      sang: sang,
      sd_old: total_caixa,
    };

    try {
      const res = await apiAcai.post("/cx/sangria", usuarioSangria);

      if (res.status === 200) {
        fecharModalSangria();
        toast.success("Sangria realizada com sucesso");
        setSang("");
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.error[0]);
      } else {
        toast.error("Erro ao realizar a sangria. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  };
  return (
    <>
      <GlobalStyle />
      <FlexContainer>
        <SideBarClass>
          <Container1>
            <LogoImage
              src={logo}
              alt="Logo"
              nav
              onClick={() => onMenuClick("Grafico")}
            />
          </Container1>
          <Container2>
            <>
              <Box
                onClick={() => {
                  if (isParamActive) {
                    onMenuClick("PesquisaCash");
                  }
                }}
              >
                {isParamActive ? (
                  <>
                    <SmallImage src={compra} alt="" />
                    <Paragraph>Inserir pedido</Paragraph>
                  </>
                ) : (
                  <Box>
                    <NavLink to="/pdv">
                      <SmallImage src={compra} alt="" />
                      <Paragraph>Inserir pedido</Paragraph>
                    </NavLink>
                  </Box>
                )}
              </Box>
              {/* <Box onClick={() => onMenuClick("Relatorio")}>
                <SmallImage src={relatorio} alt="" />
                <Paragraph> Relatorio</Paragraph>
              </Box> */}
              {isParamActive && (
                <Box onClick={() => onMenuClick("Clientes")}>
                  <SmallImage src={cliente} alt="" />
                  <Paragraph>Clientes</Paragraph>
                </Box>
              )}

              <Box onClick={() => onMenuClick("Mesas")}>
                <SmallImage src={registro} alt="" />
                <Paragraph>Mesas</Paragraph>
              </Box>
              <Box onClick={() => onMenuClick("Estoque")}>
                <SmallImage src={estoque} alt="" />
                <Paragraph> Estoque</Paragraph>
              </Box>
              <Box onClick={abrirModalFechamentoCaixa}>
                <SmallImage src={dinheiro} alt="" />
                <Paragraph>Fechamento de caixa</Paragraph>
              </Box>
              <Box onClick={abrirModalSangria}>
                <SmallImage src={sangia} alt="" />
                <Paragraph>Sangria</Paragraph>
              </Box>
              <Box onClick={() => onMenuClick("Relatorio")}>
                <SmallImage src={relatorio} alt="" />
                <Paragraph>Relatório</Paragraph>
              </Box>

              <Relatorio
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
              />
              <Cofig>
                <Box onClick={() => onMenuClick("Usuarios")}>
                  <SmallImage src={registro} alt="" />
                  <Paragraph>Usuários</Paragraph>
                </Box>
                <Box onClick={() => onMenuClick("Parametros")}>
                  <SmallImage src={configuracao} alt="" />
                  <Paragraph> Parametros</Paragraph>
                </Box>
                <Box onClick={botaoLogout}>
                  <SmallImage src={sair} alt="" />
                  <Paragraph> Sair</Paragraph>
                </Box>
              </Cofig>
              <Modal
                isOpen={modalFechamentoCaixa}
                onRequestClose={fecharModalFechamentoCaixa}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "30%",
                    height: "63%",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem modal-fechamento">
                  <h2>RELATÓRIO DIÁRIO</h2>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>(+) SALDO INICIAL: R${abertura}</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>(+) ENTRADAS DO DIA</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>Cartão de credito R${vendas_credito}</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>Cartão de Débito/alimentação R${vendas_debito}</p>
                </div>

                <div className="modal-mensagem modal-coluna">
                  <p>Dinheiro R${vendas_dinheiro}</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>PIX R${vendas_pix}</p>
                </div>

                <div className="modal-mensagem modal-coluna-col">
                  <p>FECHAMENTO DO DIA</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>(+) TOTAL DE VENDA: R${vendas_total}</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p>(+) SALDO EM CAIXA: R${total_caixa}</p>
                </div>
                <div className="modal-mensagem modal-coluna">
                  <p className="red">(-) TOTAL SANGRIA: R${vsang}</p>
                </div>
                <div className="modal-coluna-col btn-col">
                  <button onClick={abrirModalCancelamento}>
                    FECHAMENTO DO DIA
                  </button>
                </div>
              </Modal>
              <Modal
                isOpen={modalCancelamento}
                onRequestClose={fecharModalCancelamento}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "120px",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalCancelamento} />
                  <h2>Confirmação de fechamento</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja confirmar o fechamento do caixa?</h2>
                  <div className="btn-modal">
                    <button
                      onClick={handleClick}
                      className="verde"
                      disabled={enviando}
                    >
                      {enviando ? (
                        <>
                          <Spinner />
                        </>
                      ) : (
                        "Confirmar"
                      )}
                    </button>
                    <button
                      onClick={fecharModalCancelamento}
                      className="vermelho"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <Modal
                isOpen={valorSangria}
                contentLabel="Modal Produto Específico"
                style={{
                  content: {
                    width: "30%",
                    height: "50%",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalSangria} />
                  <h2>SANGRIA</h2>
                </div>
                <div className="kg kg-sangria">
                  <label>Operador do caixa</label>
                  <input
                    type="text"
                    //onChange={(e) => {
                    //setSaldoIncial(e.target.value);
                    //}}
                    value={user && user.nome}
                    disabled
                  />
                  <label>Saldo</label>
                  <input
                    type="text"
                    //onChange={(e) => {
                    //setSaldoIncial(e.target.value);
                    //}}
                    value={total_caixa}
                    disabled
                  />
                  <label>Valor que será retirado</label>
                  <input
                    type="number"
                    onChange={(e) => {
                      setSang(e.target.value);
                    }}
                    value={sang}
                  />
                  {enviando ? (
                    "Aguarde..."
                  ) : (
                    <input
                      type="button"
                      value="Enviar"
                      disabled={enviando}
                      className="botao-add botao-caixa"
                      onClick={(e) => {
                        envioSangria(e);
                      }}
                    />
                  )}
                </div>
              </Modal>
            </>
          </Container2>
          <Footer>
            <p>Versão 1.0.1</p>
          </Footer>
        </SideBarClass>
        <MainContainer></MainContainer>
      </FlexContainer>
    </>
  );
};
SideBar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default SideBar;
