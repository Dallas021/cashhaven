import "../paginas/PDV.css";
import dinhero from "../assets/img/dinheiro.png";
import ConfirmModal from "../componentes/ModalConfirmacao";
import { useState, useEffect, useLayoutEffect } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SetaVoltar from "../componentes/SetaVoltar";
import SetaFechar from "../componentes/SetaFechar";
import { IoIosCloseCircle } from "react-icons/io";
import pix from "../assets/img/pix.png";
import dinheiro_pag from "../assets/img/dinheiro_pag.png";
import cartao from "../assets/img/cartao.png";
import useProdutos from "../hooks/useProdutos";
import styled from "styled-components";
import usuario from "../assets/img/user.png";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { enviarMensagem, conectarSocket } from '../context/WebSocketEnvio.jsx';
import ModalCadastroUsuario from "../componentes/ModalCadastroUsuario.jsx";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  justify-content: space-evenly;
  @media screen and (max-width: 900px) {
    height: 1px;
    width: 50vw;
    margin: auto;
  }
`;
const LoginForm = styled.div`
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 900px) {
    padding: 40px;
    position: relative;
  }
  img {
    margin-bottom: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 20px;
    color: #5f387a;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

const Label = styled.label`
  font-weight: bold;
  color: #5f387a;
  width: 100%;
  margin: 5px 0;
  font-size: 18px;
`;

const Input = styled.input`
  padding-left: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  font-weight: bold;
  width: 100%;
  height: 2.3rem;
  margin: 5px 0;
  border-color: #5f387a;

  &::placeholder {
    color: #5f387a;
    font-weight: normal;
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #73287d;
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
const LoginContainer = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 0 10px rgb(0 0 0 / 67%);
  display: flex;
  max-width: 1200px;
  align-items: center;

  img {
    width: 100px;
  }
`;
const ButaoEnvioUsuario = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  input {
    width: 100%;
    margin-top: 40px;
    padding: 12px 90px;
    background-color: #73287d;
    border: 1px solid #73287d;
    color: #f1f1f1;
    cursor: pointer;
    transition: 0.5s;
  }
  input:hover {
    background-color: #8b43bb;
    border-radius: 50px;
    transition: 1s;
  }
`;

const PDV = ({ onMenuClick }) => {
  const [produto, setProduto] = useState("");
  const [unino, setUnino] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataHora, setDataHora] = useState(new Date());
  // const [produtos, setProdutos] = useState([]);
  const [proximoPedido, setProximoPedido] = useState("");
  const navigate = useNavigate();
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [modalCupom, setModalCupom] = useState(false);
  const [modalPesquisaAberto, setModalPesquisaAberto] = useState(false);
  const [modalResumo, setModalResumo] = useState(false);
  const [resultadoPesquisaProduto, setResultadoPesquisaProduto] = useState("");
  const [pesquisaProduto, setPesquisaProduto] = useState("");
  const [insersaoManual, setInsersaoManual] = useState(false);
  const [kgacai, setKgacai] = useState("");
  const [precoacai, setPrecoAcai] = useState("");
  const [pesoBalanca, setPesoBalanca] = useState("");
  const [codigo_produto, setCodigo_Produto] = useState("");
  // const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);
  // const [sta, setSta] = useState("");
  const [modalCancelamento, setModalCancelamento] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [modalCash, setModalCash] = useState(false);
  const [tipo, setTipo] = useState("");
  const [valor_recebido, setValor_Recebido] = useState("");
  // const [status, setStatus] = useState("");
  const [pagamentos, setPagamentos] = useState([]);
  const [modalPreco_Recebido, setModalPreco_Recebido] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  // const [senha, setSenha] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [modalInserirProdto, setModalInserirProduto] = useState(false);
  const [modalAdicionarProdudoCel, setModalAdicionarProdudoCel] =
    useState(false);
  const [tabAtiva, setTabAtiva] = useState("produto");
  const [modalFinalizarPedidoCel, setModalFinalizarPedidoCel] = useState(false);
  const [modalKgAcaiCel, setModalKgAcaiCel] = useState(false);
  const [pp, setPp] = useState("");
  //const [cp, setCp] = useState("");
  const [valorCupom, setValorCupm] = useState("");
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("kg");
  const [rec, setRec] = useState(1);
  //const [cpfLocal, setCpfLocal] = useState("123.456.789-00");
  //const [nomeLocal, setNomeLocal] = useState("João Silva");
  const [recebido, setRecebido] = useState("");
  const [vpoint, setVpoint] = useState("");
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  //const [isChecked, setIsChecked] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [point, setPoint] = useState("");
  const [cb, setCb] = useState("");
  // const [modalDinheiro, setModalDinheiro] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [isParamActive, setIsParamActive] = useState(true);
  const [clienteCash, setClienteCash] = useState("");
  const [cashCpf, setCashCpf] = useState();
  const [cashPoint, setCashPoint] = useState();
  const [isEnviando, setIsEnviando] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [endereco, setEndereco] = useState("")
  const [estado, setEstado] = useState("")
  const [razao, setRazao] = useState("")
  const [IE, setIE] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false);


  // const handleSwitchChange = (checked) => {
  //   setIsChecked(checked);
  // };

  const formatCashback = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
    return formattedValue.replace(".", ".");
  };

  const formatCurrency = (value) => {
    // Remove todos os caracteres não numéricos, exceto o ponto
    const numericValue = value.replace(/[^\d.]/g, "");

    // Se o valor tiver mais de um ponto, mantemos apenas o primeiro
    const [integer, decimal] = numericValue.split(".");
    const formattedValue = decimal
      ? `${integer}.${decimal.slice(0, 2)}`
      : integer;

    return formattedValue;
  };
  const formatCurrencyRece = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (parseFloat(numericValue) / 100).toFixed(2);
    return formattedValue.replace(",", ".");
  };
  const verificarValorRecebidoPagamentoRece = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatCurrencyRece(inputValue);
    setPrecoUnitario(formattedValue);
  };


  const verificarValorRecebidoPagamento = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatCurrencyRece(inputValue)
    setValor_Recebido(formattedValue);
  };

  const verificarQuilograma = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = parseInt(value) / 1000;
    formattedValue = formattedValue.toFixed(3);
    setKgacai(formattedValue);
    console.log(kgacai, "kg açai");
  };
  // const valorPrecoCompra = (e) => {
  //   const inputValue = e.target.value;
  //   setCompra(formatCurrency(inputValue));
  // };

  // const varificarVpoint = (e) => {
  //   const value = e.target.value;
  //   setVpoint(formatCashback(value));
  // };

  const varificarVrecebido = (e) => {
    const value = e.target.value;
    setRecebido(formatCashback(value));
  };

  /*Inicio divididindo cod - Hook produto*/
  const { produtos, adicionarProduto, removerProduto, setQuantidadeEstoque } =
    useProdutos();
  const handleAdicionarProduto = () => {
    adicionarProduto(produto, unino, precoUnitario, nome, kgacai, {
      setNome,
      setProduto,
      setUnino,
      setPrecoUnitario,
      setCodigo_Produto,
      setKgacai,
    });
  };

  /* Fim */

  const userData = JSON.parse(localStorage.getItem("user"));
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const location = useLocation();
  const origem = location.state?.origen || 0;
  const mesaCash = location.state?.cliente || 0;
  const arrayState = location.state || 0;

  //const state = location.state;
  useLayoutEffect(() => {
    if (origem === "cash") {
      handleCash();
    }
  }, [origem]);
  //Utiliação dos  location, onde puxo as informações de outra telas - Loja para clientes mesa e bolcão
  const mesa = location.state || {};
  const tipoCliente = mesa.cliente;
  const mesasFinArray = mesa.mesasFin;
  const numeroMesaAtual = mesa?.mesa?.tableid;
  const uidCash = mesa?.mesa?.id_client;

  const mesasFin = Array.isArray(mesasFinArray)
    ? mesasFinArray.filter((item) => item.tableid === numeroMesaAtual)
    : [];

  const subTotal = tipoCliente === "bolcao" ? mesa.mesa.subtotal : 0;
  const mesaId = tipoCliente === "bolcao" ? mesa.mesa.tableid : 0;

  const tipoClienteMesa = location.state || 0;
  const tableId = tipoClienteMesa?.mesa?.tableid;
  const tipoClinteTable = tipoClienteMesa.tipoCliente;

  useLayoutEffect(() => {
    if (tipoCliente === "bolcao") {
      handleCash();
    }
  }, [tipoCliente]);

  useEffect(() => {
    const carregandoDadosEmpresa = async () => {
      try {
        const res = await apiAcai.get("company/all");
        setEmpresa(res.data.message[0]);
        setBairro(res.data.message[0].bairro);
        setCidade(res.data.message[0].cidade);
        setEndereco(res.data.message[0].endereco);
        setEstado(res.data.message[0].estado);
        setCnpj(res.data.message[0].cnpj);
        setRazao(res.data.message[0].razao_social
        );
        setIE(res.data.message[0].ie);
        console.log("TESTE", bairro);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
    carregandoDadosEmpresa();
  }, []);

  const enviarPedidoParaMesa = async (e) => {
    e.preventDefault();
    try {
      const produtoPedidoMesa = produtos.map((produto) => ({
        uid: 0,
        prodno: produto.id,
        unino: produto.unino,
        valor_unit: produto.precoUnitario,
        valor_total: produto.unino * produto.precoUnitario,
        bit: 1,
        tableid: tableId,
      }));
      const res = await apiAcai.post("table/ped/insert", produtoPedidoMesa);
      if (res.status === 201) {
        navigate("/home");
        toast.success("Produto enviado para mesa");
      }
    } catch (error) {
      toast.error(error, "Erro ao enviar produto para mesa");
    }
  };

  const handleCash = () => {
    //console.log("Função executada porque origem é cash!");
    abrirModalPagamento();
  };
  //Location que pego as informações do cliente com cashback
  //1 - Esses clientes são os do cash que não vem da mesa
  const cpfLocal = arrayState?.cpf || 0;
  const nomeLocal = arrayState?.nome || 0;
  const pontosLocal = arrayState?.pontos || 0;
  const idLocal = arrayState?.id || 0;
  //2 - Esses clientes são informações clientes mesa
  useEffect(() => {
    const carregandoClienteCash = async () => {
      try {
        const res = await apiAcai.get(`/client/serachuid?cpf=${uidCash}`);
        setClienteCash(res.data.message[0].nome);
        setCashCpf(res.data.message[0].cpf);
        setCashPoint(res.data.message[0].cashback);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoClienteCash();
  }, []);

//3 = Validações clientes mesa x balcao tela cash
const  totalPontos = mesaCash === "bolcao" ? cashPoint : pontosLocal
const cpfMesa = mesaCash === "bolcao" ? cashCpf : cpfLocal;
const nomeMesa =  mesaCash === "bolcao" ? clienteCash : nomeLocal;

 
  const botaoFinalizar = () => {
    if (origem === "comCadastro") {
      abrirModalCupom();
    } else if (origem === "semCadastro") {
      abrirModalConfirmacao();
    } else if (origem === 0) {
      abrirModalConfirmacao();
    } else {
      //console.error("Origem inválida ou não definida.");
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (origem === "semCadastro") {
      const mensagemExibida = localStorage.getItem("mensagemComCadastro");
      if (!mensagemExibida) {
        Swal.fire({
          title: "Cliente não possui cadastro",
          text: "Deseja realizar o cadastro?",
          icon: "question",
          showDenyButton: true,
          confirmButtonColor: "#07921e",
          denyButtonColor: "#d33",
          confirmButtonText: "Sim, desejo cadastrar",
          denyButtonText: "Não, quero continuar a venda",
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("Usuário escolheu cadastrar");
            setMostrarModal(true);

          } else if (result.isDenied) {
            console.log("Usuário preferiu continuar a venda");
          }
          localStorage.setItem("mensagemComCadastro", "true");
        });
      }
    } else if (origem === "comCadastro") {
      const mensagemExibida = localStorage.getItem("mensagemSemCadastro");
      if (!mensagemExibida) {
        Swal.fire({
          title: "Cliente possui cadastro",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.setItem("mensagemSemCadastro", "true");
        });
      }
    } else {
      console.error("Origem inválida ou não definida.");
    }
  
    // Limpa os dados quando o componente for desmontado
    return () => {
      localStorage.removeItem("mensagemComCadastro");
      localStorage.removeItem("mensagemSemCadastro");
    };
  }, [origem]);
  

  // const comCupom = () => {
  //   navigate("/cash", {
  //     state: {
  //       arrayState,
  //       tipo: 4,
  //       valor_recebido: 10,
  //       produtos,
  //     },
  //   });
  // };

  const customStyles = {
    content: {
      width: windowSize.width <= 900 ? "75%" : "80%",
      height: windowSize.width <= 900 ? "20%" : "20%",
      margin: "auto",
      padding: 0,
      border: "1px solid #46295A",
    },
  };

  const { user } = userData || {};
  // const abrirModalKgAcaiCel = () => {
  //   setModalKgAcaiCel(true);
  // };

  const fecharModalKgAcaiCel = () => {
    setModalKgAcaiCel(false);
  };
  const abrirFinalizarPedidoCel = () => {
    setModalFinalizarPedidoCel(true);
  };

  // const fecharFinalizarPedidoCel = () => {
  //   setModalFinalizarPedidoCel(false);
  // };
  // const abrirAdicionarProdudoCel = () => {
  //   setModalAdicionarProdudoCel(true);
  //   setModalPagamento(true);
  // };
  const abrirModalCupom = () => {
    setModalCupom(true);
  };
  const fecharModalCupom = () => {
    setModalCupom(false);
  };
  const abrirModalCash = () => {
    setModalPagamento(false);
    setModalCash(true);
    setTipo(4);
    setCb(1);
  };

  const fecharModalCash = () => {
    setModalCash(false);
  };
  const fecharAdicionarProdudoCel = () => {
    setTabAtiva("produto");
    setModalAdicionarProdudoCel(false);
  };

  const abrirModalInserirProduto = () => {
    setTabAtiva("produto");
    setModalInserirProduto(true);
    //console.log("isso");
  };

  const abrirResumo = () => {
    setTabAtiva("resumo");
    setModalInserirProduto(false);
    //console.log("foi");
  };

  const semCupum = () => {
    setCb(0);
    setModalCupom(false);
    abrirModalConfirmacao(true);
    setValorCupm(0.0);
    //console.log("valor", cb);
  };

  const fecharModalInserirProduto = () => {
    setTabAtiva("resumo");
    setModalInserirProduto(false);
  };

  // const abrirModalSenha = () => {
  //   setInsersaoManual(false);
  //   setUnino(1);
  // };
  const fecharModalSenha = () => {
    setModalSenha(false);
  };
  const abrirModalConfirmacao = () => {
    setModalConfirmacaoAberto(true);
  };

  const fecharModalConfirmacao = () => {
    setModalConfirmacaoAberto(false);
  };

  const abrirModalPesquisa = () => {
    setModalPesquisaAberto(true);
  };

  const fecharModalPesquisa = () => {
    setModalPesquisaAberto(false);
  };
  const fecharModalCancelamento = () => {
    setModalCancelamento(false);
  };
  const abrirModalCancelamento = () => {
    setModalCancelamento(true);
  };
  const fecharModalKgAcai = () => {
    setInsersaoManual(false);
  };
  const abrirModalRelatorio = () => {
    setModalResumo(true);
  };
  const fecharModalRelatorio = () => {
    setModalResumo(false);
  };
  const abrirModalPagamento = () => {
    setModalPagamento(true);
    setModalConfirmacaoAberto(false);
  };
  const fecharMosalPagamento = () => {
    setModalPagamento(false);
  };
  const abrirModalPreco_Recebido = (novoTipo) => {
    setModalPreco_Recebido(true);
    setTipo(novoTipo);
  };
  const envioParaMesa = () => {
    navigate("/mesa_clientes", {
      state: {
        uid: idLocal,
        produtos: produtos,
      },
    });
  };

  const fecharModalPreco_Recebido = () => {
    setModalPreco_Recebido(false);
    setTipo("");
    setValor_Recebido("");
    setModalCupom("");
  };
  const adicionaPagamento = () => {
    const novoPagamento = {
      tipo: tipo,
      valor_recebido: parseFloat(valor_recebido), //mudei 2
    };
    setPagamentos([...pagamentos, novoPagamento]);
    fecharModalPreco_Recebido();

    setValor_Recebido("");
    //setModalCupom("");
  };

  const valorTotal = () => {
    let total = 0;
    if (tipoCliente === "bolcao") {
      total = subTotal;
    }
    produtos.forEach((produto) => {
      if (parseInt(produto.id) === 1) {
        total += produto.precoUnitario;
      } else {
        total += produto.precoUnitario * produto.unino;
      }
    });
    return total.toFixed(2);
  };
  //const valorTotalCel = valorTotal();
  const valorRecebidoPagamento = () => {
    let total = Number(valorCupom);

    pagamentos.forEach((pagamento) => {
      total += Number(pagamento.valor_recebido);
    });

    return total;
  };
  const valorTroco = () => {
    const totalValorTotal = parseFloat(valorTotal());
    const totalValorRecebidoPagamento = parseFloat(valorRecebidoPagamento());
    const troco = totalValorRecebidoPagamento - totalValorTotal;

    return troco.toFixed(2);
  };
  const botaoLimpar = () => {
    setNome("");
    setProduto("");
    setUnino("");
    setPrecoUnitario("");
    setCodigo_Produto("");
  };
  const botaoInativdo = () => {
    if (isEnviando) return false;
    const valorRecebido = parseFloat(valorRecebidoPagamento());
    const valorTrocoFalta = parseFloat(valorTotal());
    const inativo = parseFloat(valorTrocoFalta) <= parseFloat(valorRecebido);
    //console.log(inativo);
    return inativo;
  };

  const botaoCancelar = async (e) => {
    e.preventDefault(e);
    if (produtos.length === 0) {
      toast.error("Impossível cancelar o pedido, nenhum produto adicionado.");
      fecharModalCancelamento();
      return;
    }
    if (pagamentos.length === 0) {
      toast.error(
        "Impossível cancelar o pedido, sem adicionar metodo de pagamento"
      );
    }

    try {
      let acumuladorValor = 0;
      const cancelarPedido = {
        pedido: {
          produtos: produtos.map((item) => ({
            pedido: proximoPedido.message,
            prodno: item.id,
            valor_unit: item.precoUnitario,
            unino: 0,
            nome: item.nome,
            sta: 0,
            userno: user && user.nome,
          })),

          pagamentos: pagamentos.map((item) => {
            //let valorAnterior = index === 0 ? valorTotal() : acumuladorValor;
            acumuladorValor += item.valor_recebido;
            let bit3 = valorTotal() - acumuladorValor;

            return {
              pedido: proximoPedido.message,
              tipo: item.tipo,
              status: 0,
              valor_recebido: item.valor_recebido,
              valor_pedido: valorTotal(),
              bit3: bit3,
            };
          }),
        },
      };

      const res = await apiAcai.post("/ped", cancelarPedido);

      if (res.status === 200) {
        toast.success(res.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error, "Erro ao inserir produto no banco de dados");
    }
  };
  // const liberarPedido = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const usuarioCadastro = {
  //       operador_liberacao: user && user.id,
  //       pedido: proximoPedido.message,
  //       senha,
  //     };

  //     const res = await apiAcai.post("/liberacao", usuarioCadastro);

  //     if (res.status === 200) {
  //       setDisabled(false);
  //       setSenha("");
  //       toast.success("Pedido liberado para alteração");
  //       setModalSenha(false);
  //     }
  //   } catch (error) {
  //     setDisabled(false);
  //     toast.error("Usuário não é administrador ou senha incorreta");
  //   }
  // };

  const enviarValor = async (e) => {
    e.preventDefault();
    setModalSenha(false);
    setInsersaoManual(false);
    setUnino(1);
  };

  const botaoEnvio = async (e) => {
    e.preventDefault();
    if (isEnviando) return; 

    setIsEnviando(true); 

    fecharModalConfirmacao();

    try {
      const clienteSemCadastro = origem === "semCadastro";
      const payload = {
        produtos:
          tipoCliente === "bolcao"
            ? mesasFin.map((item) => ({
                pedido: proximoPedido,
                prodno: item.prodno,
                valor_unit: item.valor_unit,
                sta: 1,
                userno: user ? user.nome : 0,
              }))
            : produtos.map((item) => ({
                pedido: proximoPedido,
                prodno: item.id,
                valor_unit: item.precoUnitario,
                sta: 1,
                userno: user ? user.nome : 0,
              })),

        // produtos:
        //   origem === "bolcao"
        //     ? produtos.map((item) => ({
        //         pedido: proximoPedido,
        //         prodno: item.id,
        //         valor_unit: item.precoUnitario,
        //         sta: 1,
        //         userno: user ? user.nome : 0,
        //       }))
        //     : mesasFin.map((item) => ({
        //         pedido: proximoPedido,
        //         prodno: item.prodno,
        //         valor_unit: item.valor_unit,
        //         sta: 1,
        //         userno: user ? user.nome : 0,
        //       })),

        pagamentos: pagamentos.map((item) => ({
          pedido: proximoPedido,
          tipo: item.tipo,
          valor_recebido: item.valor_recebido,
          valor_pedido: parseFloat(valorTotal()),
          cb: cb,
          price_cb: item.tipo === 4 ? item.valor_recebido : 0,
          bit: 0,
        })),
        clients: clienteSemCadastro
          ? [
              {
                pedido: proximoPedido,
                uid: 0,
                bit: 0,
                cashback: 0,
                tableid: tipoCliente === "bolcao" ? mesaId : 0,
              },
            ]
          : [
              {
                uid: idLocal,
                pedido: proximoPedido,
                bit: 1,
                cashback: 0,
                tableid: tipoCliente === "bolcao" ? mesaId : 0,
                op: user ? user.id : 0,
              },
            ],
      };
      //console.log(payload);
      const res = await apiAcai.post("/order/create", payload);
  
      if (res.status === 200) {
        toast.success(res.data);
      
        const swalWithCustomButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn-confirmar",
            cancelButton: "btn-cancelar"
          },
          buttonsStyling: false
        });
      
        swalWithCustomButtons.fire({
          title: "Pedido finalizado com sucesso",
          text: "Deseja imprimir o cupom fiscal?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sim",
          cancelButtonText: "Não",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            const mensagemCupom = {
              data: data,
              hora: hora,
              type: "cupom",
              hash: "f2c3e4bb7b5577592d4b0c3b0fdd774084f2b1c53e2086b99bffcf74ad44d2e5f3c0a9fd3753209a967b4b3f913b6f0d81fa7509e2c62e3e7c577c28c8e084021d7ff722e6d953c535ffbc9a758c41b63d8d3ad3de89619d57c2251b91a5e4664a49a53d7e9d5e5331e5f6f3baf6c9b455ae37c1b6a56c",
              imp: "192.168.10.12",
              ped: proximoPedido.toString(),
              pedido: produtos.map((item) => ({
                codigo: `${item.id || item.prodno || "00"}`,
                unidade: "UN",
                descricao: item.nome || item.descricao || "Produto",
                valor: `R$ ${item.precoUnitario || item.valor_unit || 0},00`
              }))
            };
      
            enviarMensagem(mensagemCupom);
      
            Swal.fire({
              title: "Cupom impresso com sucesso",
              icon: "success"
            });
          }
      
          navigate("/");
        });
      }
      
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Erro inesperado:", error);
        console.log("kkkkkk", error);
      }
    } finally {
      setIsEnviando(false); 
    }
  };

  //NUMERAÇÃO DO PROXIMO PEDIDO

  useEffect(() => {
    const carregarProximoPedido = async () => {
      try {
        const res = await apiAcai.get("/order/new");
        setProximoPedido(res.data.pedido);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarProximoPedido();
  }, []);

  useEffect(() => {
    const tempo = setInterval(() => setDataHora(new Date()), 1000);

    return () => {
      clearInterval(tempo);
    };
  }, []);

  useEffect(() => {
    const carregarProximoPedido = async () => {
      try {
        const res = await apiAcai.get("/nextped");
        setProximoPedido(res.data);
        setPrecoAcai(res.data.valor);
        setPp(res.data.pp);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarProximoPedido();
  }, []);

  const handlePesquisaProduto = async (pesquisaProduto) => {
    try {
      const encodedPesquisaProduto = encodeURIComponent(pesquisaProduto);
      const res = await apiAcai.get(
        `stock/serach/name?nome=${encodedPesquisaProduto}`
      );

      setResultadoPesquisaProduto(res.data.message);
      console.log("aqui karol", res.data.message);
    } catch (error) {
      console.error("Erro ao encontrar produto:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPesquisaProduto(value);

    if (value.trim()) {
      handlePesquisaProduto(value); // Chama a função de pesquisa a cada letra digitada
    }
  };

  const handleProdutoSelecionado = (produtoSelecionado) => {
    if (produtoSelecionado.id === 1) {
      //console.log("cele", produtoSelecionado);
      abrirModalPesquisa(false);
      setInsersaoManual(true);
      setUnino(kgacai);
      setNome(produtoSelecionado.product);
      setProduto(produtoSelecionado.id);
      setQuantidadeEstoque(produto.sd);
    } else {
      abrirModalPesquisa(false);
      if (parseFloat(produtoSelecionado.sd) > 0) {
        setNome(produtoSelecionado.product);
        setPrecoUnitario(produtoSelecionado.p_venda);
        setProduto(produtoSelecionado.id);
        setQuantidade(produtoSelecionado.quantidade);
        setQuantidadeEstoque(produto.sd);
      } else {
        // setNome("");
        // setPrecoUnitario("");
        // setProduto("");
        // toast.error("Produto sem estoque");
      }
    }

    setModalPesquisaAberto(false);
    setPesquisaProduto("");
  };
  const verificarCodigoProduto = async (id) => {
    try {
      if (parseInt(id) === 1) {
        setInsersaoManual(true);
        //setModalKgAcaiCel(true);
        setModalInserirProduto(false);
        setModalAdicionarProdudoCel(false);
        setCodigo_Produto(id);
        await carregandoEstoque(id);
      } else {
        const res = await apiAcai.get(`stock/serach/id?id=${id}`);
        if (res.status === 200) {
          const produto = res.data.message[0];
          //console.log("eu", produto);
          if (produto.id === 1) {
            setInsersaoManual(true);
            setUnino(kgacai);
            setNome(produto.product);
            setProduto(produto.id);
            setQuantidadeEstoque(produto.quantidade);
            setPrecoUnitario(produto.p_venda);
          } else {
            abrirModalPesquisa(false);
            if (parseFloat(produto.quantidade) > 0) {
              setNome(produto.product);
              setPrecoUnitario(produto.p_venda);
              setProduto(produto.id);
              setQuantidade(produto.quantidade);
              setQuantidadeEstoque(produto.quantidade);
              setModalAdicionarProdudoCel(true);
            } else {
              setNome("");
              setPrecoUnitario("");
              setProduto("");
              toast.error("Produto sem estoque");
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calculoKg = () => {
    let totalAcai = 0;
    let totalUnino = 0;
    // totalAcai = parseFloat(((kgacai / 1000) * precoUnitario).toFixed(2));
    totalAcai = parseFloat(kgacai * precoUnitario).toFixed(2);
    totalUnino = kgacai;
    // totalUnino = parseFloat((kgacai / 1000).toFixed(2));
    setPrecoUnitario(totalAcai);
    setUnino(totalUnino);
    console.log("buu2", precoUnitario, kgacai, "total", totalUnino, totalAcai);
    setInsersaoManual(false);
    setModalKgAcaiCel(false);
    //setModalAdicionarProdudoCel(true);
  };

  const carregandoBalanca = async () => {
    try {
      const res = await apiAcai.get("/peso");
      setPesoBalanca(res.data.peso);
      setKgacai(res.data.peso);
      //calculoKg()
      calculoBalanca();
    } catch (error) {
      console.log("Errooo", error);
    }
  };

  const calculoBalanca = () => {
    let totalAcaiBalaca = pesoBalanca * precoacai;
    setPrecoUnitario(totalAcaiBalaca);
  };

  const carregandoEstoque = async (id) => {
    try {
      const res = await apiAcai.get(`stock/serach/id?id=${id}`);
      if (res.status === 200) {
        const produdoEsto = res.data.message[0];
        console.log("eu", produdoEsto);
        if (produdoEsto.id === 1) {
          setUnino(kgacai);
          setNome(produdoEsto.product);
          setProduto(produdoEsto.id);
          setQuantidadeEstoque(produdoEsto.quantidade);
          setPrecoUnitario(produdoEsto.p_venda);
        } else {
          if (parseFloat(produdoEsto.quantidade) > 0) {
            setNome(produdoEsto.nome);
            setPrecoUnitario(produdoEsto.p_venda);
            setProduto(produdoEsto.id);
            setQuantidade(produdoEsto.quantidade);
            setQuantidadeEstoque(produdoEsto.quantidade);
            setModalAdicionarProdudoCel(true);
          } else {
            // setNome("");
            // setPrecoUnitario("");
            // setProduto("");
            // toast.error("Produto sem estoque");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const data = dataHora.toLocaleDateString();
  const hora = dataHora.toLocaleTimeString();

  useEffect(() => {}, [produtos]);

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     setProduto(e.target.value);
  //     verificarCodigoProduto(e.target.value);
  //     carregandoEstoque(e.target.value);
  //   }
  // };
  useEffect(() => {
    const carregandoLoock = async () => {
      try {
        const resLock = await apiAcai.get("/lock");
        const ppValue = resLock.data.success[0].pp;
        //console.log("aqui", ppValue);
        if (ppValue === 1) {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
      } catch (error) {
        console.log("Ocorreu um erro", error);
      }
    };

    carregandoLoock();
  }, []);

  // useEffect(() => {
  //   const carregandoRec = async () => {
  //     try {
  //       const resLock = await apiAcai.get("/rec ");
  //       setRec(resLock.data.data[0].bit);
  //     } catch (error) {
  //       console.log("Ocorreu um erro", error);
  //     }
  //   };

  //   carregandoRec();
  // }, []);
  const handleOpcaoChange = (event) => {
    const opcao = event.target.value;
    setOpcaoSelecionada(opcao);

    if (opcao === "dinheiro") {
      setModalSenha(true);
    } else {
      setModalSenha(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("rece",valor_recebido,pontosLocal)
    if (parseFloat(valor_recebido) > parseFloat(totalPontos)) {
      toast.error(
        "O valor do cashback não pode ser maior que os pontos disponíveis."
      );
      return;
    }
    setTipo(4);
    adicionaPagamento();
    fecharModalCash();
    fecharModalCupom();
    abrirModalPagamento();
  };
  return (
    <>
    <ModalCadastroUsuario
        isOpen={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
        onSuccess={() => {
          // callback de sucesso após o cadastro
          console.log("Cadastro realizado com sucesso!");
        }}
      />
      <nav>
        <div className="seta">
          <SetaVoltar />
        </div>
        <h1>PONTO DE VENDA</h1>
      </nav>
      <header className="pedidos">
        <div className="container-1">
          <div className="pedido-n">
            <h2>Pedido #{proximoPedido}</h2>
            <h2>{dataHora.toLocaleString()}</h2>
          </div>
          <div className="linha"></div>
          <div className="pedido-n-n">
            <img src={dinhero} alt="" />
            <h2>R$ {valorTotal()}</h2>
          </div>
          <div className="cliente">
            <p>CLIENTE BALCAO</p>
          </div>
          <div className="finaliza">
            <div className="box-1">
              <input
                type="button"
                value="FINALIZAR"
                id="verde"
                onClick={(e) =>
                  tipoClinteTable === "mesa"
                    ? enviarPedidoParaMesa(e)
                    : semCupum()
                }
              />
              {isParamActive ? (
                <ConfirmModal
                  isOpen={modalConfirmacaoAberto}
                  onRequestClose={fecharModalConfirmacao}
                  title="Envio de pedido"
                  message="O cliente é:"
                  btn1="BALCÃO"
                  btn2="MESA"
                  onConfirm={abrirModalPagamento}
                  onCancel={envioParaMesa}
                />
              ) : (
                <ConfirmModal
                  isOpen={modalConfirmacaoAberto}
                  onRequestClose={fecharModalConfirmacao}
                  title="Confirmação do pedido"
                  message="Deseja finalizar o pedido?"
                  btn1="SIM"
                  btn2="NÃO"
                  onConfirm={abrirModalPagamento}
                  onCancel={fecharModalConfirmacao}
                />
              )}

              {origem === "comCadastro" && (
                <ConfirmModal
                  isOpen={modalCupom}
                  onRequestClose={fecharModalCupom}
                  title="Cashback do cliente"
                  message="Cliente possue cashback, deseja utilizar?"
                  btn1="SIM"
                  btn2="NÃO"
                  onConfirm={abrirModalCash}
                  onCancel={semCupum}
                />
              )}
              <Modal isOpen={modalCash} onRequestClose={fecharModalCash}>
                <Container>
                  <LoginContainer>
                    <LoginForm>
                      <img src={usuario} alt="" />

                      <Form>
                        <p>Dados do cliente:</p>

                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          type="text"
                          id="cpf"
                          name="cpf"
                          placeholder="Digite o CPF do cliente"
                          value={cpfMesa}
                          onChange={(e) => setCpf(e.target.value)}
                          disabled
                        />
                      </Form>
                      <Form>
                        <Label>Nome</Label>
                        <Input
                          type="text"
                          value={
                            nomeMesa
                          }
                          onChange={(e) => setName(e.target.value)}
                          disabled
                        />
                      </Form>
                      <Form>
                        <Label>Pontos</Label>
                        <Input
                          type="text"
                          value={
                            totalPontos
                          }
                          onChange={(e) => setPoint(e.target.value)}
                          disabled
                        />
                      </Form>
                    </LoginForm>
                  </LoginContainer>
                  <LoginContainer>
                    <LoginForm>
                      <form onSubmit={(e) => handleSubmit(e)}>
                        <Form>
                          <p>Dados do pedido:</p>
                          <Label>Valor do pedido</Label>
                          <Input
                            type="number"
                            name="pedido"
                            placeholder="Valor do pedido do cliente"
                            value={valorTotal()}
                            onChange={varificarVrecebido}
                            disabled
                          />
                        </Form>
                        <Form>
                          <Label>Cashback utlizado</Label>
                          <Input
                            type="number"
                            name="pedido"
                            placeholder="Valor utilizado pelo cliente"
                            value={valor_recebido}
                            onChange={verificarValorRecebidoPagamento}
                            // disabled={!verificarBp()}
                          />
                        </Form>
                        <ButaoEnvioUsuario>
                          {enviando ? (
                            <Spinner />
                          ) : (
                            <input
                              type="submit"
                              value="Enviar valor"
                              disabled={enviando}
                            />
                          )}
                        </ButaoEnvioUsuario>
                      </form>
                    </LoginForm>
                  </LoginContainer>
                </Container>
              </Modal>
              <Modal
                isOpen={modalPagamento}
                onRequestClose={fecharMosalPagamento}
                style={{
                  content: {
                    maxWidth: "80%",
                    maxHeight: "100%",
                    margin: "auto",
                    padding: 0,
                    backgroundColor: "#f8f4f4",
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharMosalPagamento} />
                  <h2>Pagamento</h2>
                </div>
                <div className="flex_pagamento">
                  <div>
                    <div className="tabela_pagamento">
                      <table className="tabela_resumo tabela_pag">
                        <thead>
                          <tr>
                            <th className="thPDV">Código</th>
                            <th className="thPDV">Desc</th>
                            <th className="thPDV">Qtd</th>
                            <th className="thPDV">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {produtos.map((produto, index) => (
                            <tr key={produto.id ? produto.id : index}>
                              <td className="tdPDV">{produto.id}</td>
                              <td className="tdPDV">{produto.nome}</td>
                              <td className="tdPDV">{produto.unino}</td>
                              <td className="tdPDV">
                                R$
                                {parseFloat(produto.id) === 1
                                  ? `${produto.precoUnitario}`
                                  : `${produto.precoUnitario * produto.unino}`}
                              </td>
                            </tr>
                          ))}
                          {mesa.tipo === "bolcao" ? (
                            Array.isArray(produtos) ? (
                              produtos.map((produto, index) => (
                                <tr key={produto.id ? produto.id : index}>
                                  <td className="tdPDV">{produto.id}</td>
                                  <td className="tdPDV">{produto.nome}</td>
                                  <td className="tdPDV">{produto.unino}</td>
                                  <td className="tdPDV">
                                    R$
                                    {parseFloat(produto.id) === 1
                                      ? `${produto.precoUnitario}`
                                      : `${
                                          produto.precoUnitario * produto.unino
                                        }`}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="tdPDV">
                                  Nenhum produto encontrado.
                                </td>
                              </tr>
                            )
                          ) : Array.isArray(mesasFin) ? (
                            mesasFin.map((mesaFin, index) => (
                              <tr key={mesaFin.prodno ? mesaFin.prodno : index}>
                                <td className="tdPDV">{mesaFin.prodno}</td>
                                <td className="tdPDV">{mesaFin.product}</td>
                                <td className="tdPDV">{mesaFin.unino}</td>
                                <td className="tdPDV">
                                  R$
                                  {parseFloat(mesaFin.id) === 1
                                    ? `${mesaFin.valor_unit}`
                                    : `${mesaFin.valor_unit * mesaFin.unino}`}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="tdPDV">
                                Nenhuma mesa encontrada.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Modal
                      isOpen={modalPreco_Recebido}
                      onRequestClose={fecharModalPreco_Recebido}
                      contentLabel="Modal Produto Específico"
                      style={{
                        content: {
                          width: "50%",
                          height: "300px",
                          margin: "auto",
                          padding: 0,
                        },
                      }}
                    >
                      <div className="modal-mensagem">
                        <SetaFechar Click={fecharModalPreco_Recebido} />
                        <h2>Valor recebido por cliente</h2>
                      </div>
                      <div className="kg">
                        <label>Valor Recebido </label>
                        <input
                          type="text"
                          value={valor_recebido}
                          onChange={verificarValorRecebidoPagamento}
                        />
                        <input
                          type="button"
                          value="Lançar Adicionar Valor"
                          className="botao-add"
                          onClick={() => {
                            adicionaPagamento();
                          }}
                        />
                      </div>
                    </Modal>
                    <div className="container-box">
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(0)}
                      >
                        <img src={pix} alt="" />
                        <p>PIX</p>
                      </div>
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(1)}
                      >
                        <img src={dinheiro_pag} alt="" />
                        <p>DINHEIRO</p>
                      </div>
                    </div>
                    <div className="container-box">
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(2)}
                      >
                        <img src={cartao} alt="" />
                        <p>
                          CARTÃO DE <br /> CRÉDITO
                        </p>
                      </div>
                      <div
                        className="box"
                        onClick={() => abrirModalPreco_Recebido(3)}
                      >
                        <img src={cartao} alt="" />
                        <p>
                          CARTÃO DE <br /> DEBITO
                        </p>
                      </div>
                    </div>
                    {origem !== "semCadastro" && (
                      <div className="container-box-2">
                        <div className="box" onClick={() => abrirModalCash()}>
                          <img src={cartao} alt="" />
                          <p>CASHBACK</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="input-pagamento">
                    <label>Valor Total</label>
                    <input type="number" value={valorTotal()} disabled />
                    <label>Valor Recebido</label>
                    <input
                      type="number"
                      value={valorRecebidoPagamento()}
                      disabled

                      
                    />
                    <label>Valor Troco</label>
                    <input type="number" value={valorTroco()} disabled />
                    <div className="btn-pagamento">
                      <button
                        className="btn-finalizar"
                        onClick={botaoEnvio}
                        disabled={!botaoInativdo()}
                      >
                        Finalizar
                      </button>
                      <button
                        className="btn-cancelar-pagamento"
                        onClick={abrirModalCancelamento}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
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
                  <h2>Confirmação de cancelamento</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja cancelar o pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={botaoCancelar} className="verde">
                      Confirmar
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
              <input
                type="button"
                value="RESUMO"
                onClick={abrirModalRelatorio}
              />
              <Modal
                isOpen={modalResumo}
                onRequestClose={fecharModalRelatorio}
                style={{
                  content: {
                    maxWidth: "70%",
                    minHeight: "95%",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalRelatorio} />
                  <h2>RESUMO</h2>
                </div>
                <div className="acai-flex">
                  <div className="flex-dados-1">
                    <p>{razao}</p>
                    <br />
                    <p className="endereco">
                      {endereco} - {bairro} - {cidade}/{estado}
                    </p>
                    <br />
                    <br />
                    <h2>CNPJ: {cnpj
                      }</h2>
                    <h2>IE:{IE} </h2>
                  </div>
                  <div className="flex-dados-2">
                    <h2>{data}</h2>
                    <h2>{hora}</h2>
                    <h2>PED: {proximoPedido}</h2>
                  </div>
                </div>
                <hr style={{ border: "1px dashed #838383" }} />
                <br />
                <div className="flex-dados-1">
                  <p>CUPOM FISCAL</p>
                  <table className="tabela_resumo">
                    <thead>
                      <tr>
                        <th className="thPDV">CÓD</th>
                        <th className="thPDV">UNI</th>
                        <th className="thPDV">DESC</th>
                        <th className="thPDV">VALOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map((produto, index) => (
                        <tr key={produto.id ? produto.id : index}>
                          <td className="tdPDV">{produto.id}</td>
                          <td className="tdPDV">{produto.unino}</td>
                          <td className="tdPDV">{produto.nome}</td>
                          <td className="tdPDV">
                            R$
                            {parseFloat(produto.id) === 1
                              ? `${produto.precoUnitario}`
                              : `${produto.precoUnitario * produto.unino}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                </div>
                <hr style={{ border: "1px dashed #838383" }} />
                <div className="total">
                  <p>TOTAL R$ {valorTotal()}</p>
                </div>
                <hr style={{ border: "1px dashed #838383" }} />
                <div className="rodape">
                  <p>ESSE CUPOM NÃO TEM VALOR FISCAL</p>
                </div>
                <div className="rodape">
                  <p>Desenvolvido por www.celebreprojetos.com.br</p>
                </div>
              </Modal>
            </div>
            <div className="box-2">
              <input
                type="button"
                value="CANCELAR"
                id="vermelho"
                onClick={abrirModalCancelamento}
              />
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
                  <h2>Confirmação de cancelamento</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja cancelar o pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={botaoCancelar} className="verde">
                      Confirmar
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
              <input
                type="button"
                value="PROCURAR PRODUTO"
                onClick={abrirModalPesquisa}
              />
              <Modal
                isOpen={modalPesquisaAberto}
                onRequestClose={fecharModalPesquisa}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "60%",
                    maxHeight: "100%",
                    margin: "auto",
                    padding: 0,
                    overflowX: "auto",
                  },
                }}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalPesquisa} />
                  <h2>Digite o produto que deseja pesquisar</h2>
                </div>
                <div className="container-modal-produto">
                  <h2>Produto</h2>
                  <input
                    type="text"
                    value={pesquisaProduto}
                    onChange={handleInputChange}
                  />
                </div>
                {pesquisaProduto.trim() === "" ? null : (
                  <table className="produtos-pesquisa">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(resultadoPesquisaProduto) &&
                      resultadoPesquisaProduto.length > 0 ? (
                        resultadoPesquisaProduto.map((produto) => (
                          <tr
                            key={produto.id}
                            onClick={() => handleProdutoSelecionado(produto)}
                          >
                            <td>{produto.id}</td>
                            <td>{produto.product}</td>
                            <td>{produto.p_venda}</td>
                            <td>{produto.sd}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2">Nenhum resultado encontrado</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </Modal>
            </div>
          </div>
        </div>
        <div className="container-2">
          <div className="box-produto">
            <form className="form-01">
              <div className="box-flex">
                <label>Produto</label>
                <input
                  required
                  type="number"
                  onChange={(e) => {
                    setProduto(e.target.value);
                    verificarCodigoProduto(e.target.value);
                    carregandoEstoque(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleProdutoSelecionado(e);
                    }
                  }}
                  value={produto}
                />

                <Modal
                  isOpen={insersaoManual}
                  onRequestClose={fecharModalKgAcai}
                  contentLabel="Modal Produto Específico"
                  style={customStyles}
                >
                  <div className="modal-mensagem">
                    <SetaFechar Click={fecharModalKgAcai} />
                    <h2>Produto por peso</h2>
                  </div>

                  {rec === 0 ? (
                    <div className="kg">
                      <label>Lançar Quilograma</label>
                      <input
                        type="text"
                        placeholder="Digite o peso em quilogramas"
                        onChange={verificarQuilograma}
                        value={kgacai}
                        disabled={disabled}
                      />
                      <input
                        type="button"
                        value="Ler balança"
                        className="botao-add"
                        onClick={carregandoBalanca}
                      />
                      <input
                        type="button"
                        value="Lançar Peso"
                        className="botao-add"
                        onClick={calculoKg}
                      />
                    </div>
                  ) : (
                    <div className="kg">
                      <div className="opcao-selecao">
                        <select
                          value={opcaoSelecionada}
                          onChange={handleOpcaoChange}
                        >
                          <option value="kg">Lançar Quilograma</option>
                          <option value="dinheiro">Lançar Dinheiro</option>
                        </select>
                      </div>

                      {opcaoSelecionada === "kg" ? (
                        <>
                          <input
                            required
                            type="text"
                            placeholder="Digite a Quilograma do Produto"
                            value={kgacai}
                            onChange={verificarQuilograma}
                          />
                          <input
                            type="button"
                            value="Lançar valor a ser pago"
                            className="botao-add"
                            onClick={calculoKg}
                          />
                        </>
                      ) : (
                        <Modal
                          isOpen={modalSenha}
                          onRequestClose={fecharModalSenha}
                          contentLabel="Modal Produto Específico"
                          style={{
                            content: {
                              width: "60%",
                              height: "120px",
                              margin: "auto",
                              padding: 0,
                            },
                          }}
                        >
                          <div className="modal-mensagem">
                            <SetaFechar Click={fecharModalSenha} />
                            <h2>Lançar valor a ser pago</h2>
                          </div>
                          <div className="kg">
                            <label>Valor a ser pago</label>
                            <input
                              required
                              type="text"
                              value={precoUnitario}
                              onChange={verificarValorRecebidoPagamentoRece}
                            />
                            <input
                              type="button"
                              value="Enviar"
                              className="botao-add"
                              onClick={(e) => {
                                enviarValor(e);
                              }}
                            />
                          </div>
                        </Modal>
                      )}
                    </div>
                  )}
                </Modal>
              </div>

              <div className="box-flex">
                <label>Quantidade</label>
                <input
                  type="number"
                  onChange={(e) => setUnino(e.target.value)}
                  value={produto === "1" ? kgacai : unino}
                  required
                />
              </div>

              <div className="box-flex">
                <label>Valor Unit.</label>
                <input
                  required
                  type="number"
                  value={precoUnitario}
                  onChange={(e) => setPrecoUnitario(e.target.value)}
                  disabled
                />
              </div>
            </form>

            <form className="form-01">
              <div className="box-flex">
                <label>Descrição</label>
                <div className="flex-desc">
                  <input
                    required
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled
                  />
                  <input
                    className="botao-add btn-pdv"
                    type="button"
                    value="+ Inserir Produto"
                    onClick={handleAdicionarProduto}
                  />
                  <input
                    type="button"
                    value="Limpar Produtos"
                    className="botao-add btn-pdv"
                    onClick={botaoLimpar}
                  />
                </div>
              </div>
            </form>
          </div>
          <table className="tabela_pdv">
            <thead>
              <tr>
                <th className="thPDV">PRODUTO</th>
                <th className="thPDV">QTD</th>
                <th className="thPDV">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, index) => (
                <tr key={index}>
                  <td className="tdPDV">{produto.nome}</td>
                  <td className="tdPDV">{produto.unino}</td>
                  <td className="tdPDV pdvFlex">
                    R$
                    {parseFloat(produto.id) === 1
                      ? `${produto.precoUnitario}`
                      : `${produto.precoUnitario * produto.unino}`}
                    <IoIosCloseCircle
                      color="red"
                      size={30}
                      style={{ cursor: "pointer" }}
                      onClick={() => removerProduto(produto.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
      <div className="celular-tab">
        <h1
          onClick={abrirModalInserirProduto}
          className={tabAtiva === "produto" ? "tab-ativa" : ""}
        >
          Produto
        </h1>
        <h1
          onClick={abrirResumo}
          className={tabAtiva === "resumo" ? "tab-ativa" : ""}
        >
          Resumo
        </h1>
      </div>

      <div className="conteudo-tabs">
        {tabAtiva === "produto" && (
          <div className="inserir-produto-celular">
            <Modal
              isOpen={modalInserirProdto}
              onRequestClose={fecharModalInserirProduto}
              contentLabel="Modal Produto Específico"
              style={{
                content: {
                  width: "80%",
                  height: "150px",
                  margin: "auto",
                  padding: 0,
                  border: "1px solid #46295A",
                },
              }}
            >
              <div className="nav-modal-cel">
                <p>INSERIR PRODUTO</p>
                <IoIosCloseCircle
                  size={25}
                  nav-modal-cel
                  style={{
                    color: "red",
                  }}
                  onClick={() => {
                    fecharModalInserirProduto();
                  }}
                />
              </div>
              <div className="body-modal-cel">
                <label>Código</label>
                <input
                  type="number"
                  value={produto}
                  className="codigo-produto-cel"
                  onChange={(e) => {
                    setProduto(e.target.value);
                    verificarCodigoProduto(e.target.value);
                    carregandoEstoque(e.target.value);
                    //fecharModalInserirProduto(e);
                    //fecharModalKgAcai(e);
                  }}
                />
                <input
                  type="button"
                  value="Procurar por nome"
                  className="botao-add-cel"
                />
              </div>
            </Modal>
            <Modal
              isOpen={modalKgAcaiCel}
              onRequestClose={fecharModalKgAcaiCel}
              contentLabel="Modal Produto Específico"
              style={{
                content: {
                  width: "80%",
                  height: "150px",
                  margin: "auto",
                  padding: 0,
                  border: "1px solid #46295A",
                },
              }}
            >
              <div className="nav-modal-cel">
                <p>Produto por peso</p>
                <IoIosCloseCircle
                  size={25}
                  nav-modal-cel
                  style={{
                    color: "red",
                  }}
                  onClick={() => {
                    fecharModalKgAcaiCel();
                  }}
                />
              </div>
              <div className="body-modal-cel">
                <label>Digite a grama</label>
                <input
                  type="number"
                  onChange={(e) => {
                    setKgacai(e.target.value);
                  }}
                  onClick={calculoKg}
                />
              </div>
            </Modal>
            <Modal
              isOpen={modalAdicionarProdudoCel}
              onRequestClose={fecharAdicionarProdudoCel}
              contentLabel="Modal Produto Específico"
              style={{
                content: {
                  width: "80%",
                  height: "400px",
                  margin: "auto",
                  padding: 0,
                  border: "1px solid #46295A",
                },
              }}
            >
              <div className="container-add-produto-cel">
                <div className="modal-adicionar-produto">
                  <div className="borde-produto">
                    <p>{nome}</p>
                  </div>
                </div>
                <div className="input-cel-add">
                  <div className="box-cel">
                    <label>Quantidade</label>
                    <input
                      type="number"
                      value={produto === "1" ? kgacai : unino}
                      className="codigo-produto-add-cel"
                      onChange={(e) => {
                        setUnino(e.target.value);
                      }}
                    />
                  </div>
                  <div className="box-cel">
                    <label>Valor unitario</label>
                    <input
                      required
                      type="number"
                      className="codigo-produto-add-cel"
                      value={precoUnitario}
                      onChange={(e) => setPrecoUnitario(e.target.value)}
                      disabled
                    />
                  </div>
                  <input
                    type="button"
                    value="Adicionar"
                    className="botao-add-lista-cel"
                    onClick={() => {
                      adicionarProduto();
                      fecharModalInserirProduto();
                      fecharAdicionarProdudoCel();
                    }}
                  />
                </div>
              </div>
            </Modal>
          </div>
        )}

        {tabAtiva === "resumo" && (
          <div className="resumo-celular">
            <table className="tabela-cel-resumo">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => (
                  <tr key={index}>
                    <td>{produto.nome}</td>
                    <td>{produto.unino}</td>
                    <td>
                      R$
                      {parseInt(produto.id) === 1
                        ? `${produto.precoUnitario}`
                        : `${produto.precoUnitario * produto.unino}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="total-pedido-cel">
          <p>TOTAL</p>
          <p>R$ {valorTotal()}</p>
        </div>
        <div className="container-cel">
          <input
            type="button"
            value="FINALIZAR PEDIDO"
            className="botao-finalizar-cel"
            onClick={abrirFinalizarPedidoCel}
          />
        </div>
        <Modal
          isOpen={modalFinalizarPedidoCel}
          onRequestClose={fecharAdicionarProdudoCel}
          style={{
            content: {
              width: "80%",
              height: "100%",
              padding: 0,
              margin: 0,
              backgroundColor: "#f8f4f4",
            },
          }}
        >
          <div className="modal-mensagem">
            <SetaFechar Click={fecharMosalPagamento} />
            <h2>Pagamento</h2>
          </div>
          <div className="flex_pagamento_cel">
            <div className="input-pagamento-cel">
              <div className="box-cel-pag">
                <label>Valor Total</label>
                <input type="number" value={valorTotal()} disabled />
              </div>
              <div className="box-cel-pag">
                <label>Valor Pago</label>
                <input
                  type="number"
                  value={valorRecebidoPagamento()}
                  disabled
                />
              </div>
              <div className="box-cel-pag">
                <label>Valor Troco</label>
                <input type="number" value={valorTroco()} disabled />
              </div>
            </div>
            <div>
              <Modal
                isOpen={modalPreco_Recebido}
                onRequestClose={fecharModalPreco_Recebido}
                contentLabel="Modal Produto Específico"
                style={customStyles}
              >
                <div className="modal-mensagem">
                  <SetaFechar Click={fecharModalPreco_Recebido} />
                  <h2>Valor recebido por cliente</h2>
                </div>
                <div className="kg">
                  <label>Valor Recebido </label>
                  <input
                    type="number"
                    onChange={(e) => {
                      setValor_Recebido(e.target.value);
                    }}
                  />
                  <input
                    type="button"
                    value="Adicionar"
                    className="botao-add-cel"
                    onClick={() => {
                      adicionaPagamento();
                    }}
                  />
                </div>
              </Modal>

              <div className="container-box">
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(0)}
                >
                  <img src={pix} alt="" />
                  <p>PIX</p>
                </div>
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(1)}
                >
                  <img src={dinheiro_pag} alt="" />
                  <p>DINHEIRO</p>
                </div>
              </div>
              <div className="container-box">
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(2)}
                >
                  <img src={cartao} alt="" />
                  <p>
                    CARTÃO DE <br /> CRÉDITO
                  </p>
                </div>
                <div
                  className="box-cel-p"
                  onClick={() => abrirModalPreco_Recebido(3)}
                >
                  <img src={cartao} alt="" />
                  <p>
                    CARTÃO DE <br /> DEBITO
                  </p>
                </div>
              </div>
              <div className="btn-pagamento">
              <button
                className="btn-finalizar"
                onClick={botaoEnvio}
                disabled={!botaoInativdo()}
              >
                {isEnviando ? "Enviando..." : "Finalizar"}
              </button>

                <button
                  className="btn-cancelar-pagamento"
                  onClick={botaoCancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <footer>Software Licensiado pela Célebre </footer>
    </>
  );
};
PDV.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
export default PDV;
