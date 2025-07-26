import styled, { createGlobalStyle } from "styled-components";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config.js";
import Modal from "react-modal";
import { usuarioSchema } from "../utils/validador.js";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaWhatsappSquare } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InputButao from "../componentes/botao/InputBotao.jsx";
import ModalCadastroUsuario from "../componentes/ModalCadastroUsuario.jsx";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
    margin-left: 30px;
  }

  .btn-success {
    background-color: #28a745;
    color: white;
    border: none;
  }

  .btn-success:hover {
    background-color: #218838;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
    border: none;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }
`;
const NavBar = styled.nav`
  height: 80px;
  margin-top: 5px;
  margin-left: 30px;
  padding: 0px 30px;
  width: 95%;
  background-color: #712976;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
`;
const Flex = styled.div`
  display: flex;
`;
const ContainerFlex = styled.div`
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
`;

const InputPesquisa = styled.input`
  min-width: 25%;
  border-radius: 10px;
  height: 50px;
  padding-left: 10px;

  border: none;
  font-size: 20px;
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
  }
  th {
    background-color: #73287d;
    color: #fff;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
`;

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
const Paginacao = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;
const PaginacaoBotao = styled.button`
  background-color: #712976;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #8b43bb;
    transition: 0.3s;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [id, setId] = useState("");
  const [deletarCliente, setDeletarCliente] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalEditarCliente, setModalEditarCliente] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();
  const schema = yup.object({
    nome: yup.string().required("O nome é obrigatório"),
    cpf: yup
      .string()
      .required("O CPF é obrigatório")
      .matches(/^\d{11}$/, "O CPF deve conter 11 dígitos"),
    email: yup
      .string()
      .required("O email é obrigatório")
      .email("Digite um e-mail válido"),
    telefone: yup
      .string()
      .required("O telefone é obrigatório")
      .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato de telefone inválido"),
    endereco: yup.string().required("O endereço é obrigatório"),
    numero: yup.string().required("O número é obrigatório"),
    bairro: yup.string().required("O bairro é obrigatório"),
    cidade: yup.string().required("A cidade é obrigatória"),
    uf: yup
      .string()
      .required("O estado é obrigatório")
      .length(2, "UF deve ter 2 letras"),
  });

  const atualizarCliente = async (id, name, cpf, telefone) => {
    try {
      const token = localStorage.getItem("token");

      const res = await apiAcai.put(
        "/client/update",
        { id, name, cpf, telefone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Cliente atualizado com sucesso!");
        fecharModalEditor();
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((user) =>
            user.id === id ? { ...user, name, cpf, telefone } : user
          )
        );
      } else {
        toast.error("Erro ao atualizar cliente!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar cliente!");
    }
  };

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const res = await apiAcai.get("/client/all", {});
        setUsuarios(res.data.message);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarUsuarios();
  }, []);

  const abrirModal = () => {
    setModalAberto(true);
  };
  const fecharModal = () => {
    setModalAberto(false);
  };

  const abrirModalEditor = () => {
    setModalEditarCliente(true);
  };
  const fecharModalEditor = () => {
    setName("");
    setCpf("");
    setTelefone("");
    setId("");
    setModalEditarCliente(false);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setCpf(formatCPF(value));
  };

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };
  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const apenasNumeros = cpf.replace(/\D/g, "");
    return apenasNumeros.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      "$1.$2.$3-$4"
    );
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "";
    const apenasNumeros = telefone.replace(/\D/g, "");
    if (apenasNumeros.length === 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
    } else if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
    }
    return telefone;
  };

  const cadastrarUsuario = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, preencha o nome do cliente.");
      return;
    }

    if (!cpf.trim()) {
      toast.error("Por favor, preencha o CPF.");
      return;
    }

    if (!telefone.trim()) {
      toast.error("Por favor, preencha o telefone.");
      return;
    }

    const cpfSemFormatacao = cpf.replace(/\D/g, "");

    const dados = { name, cpf: cpfSemFormatacao, telefone };

    setEnviando(true);

    try {
      await usuarioSchema.validate(dados, { abortEarly: false });
      const res = await apiAcai.post("/client/create", dados);
      if (res.status === 200) {
         window.location.reload();
        navigate("/home");

        fecharModal();
      }
      
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      }
    } finally {
      setEnviando(false);
    }
  };

  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
  };

  const itensPorPagina = 11;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;

  const filtroUsuarios = Array.isArray(usuarios)
    ? usuarios.filter(
        (usuario) =>
          usuario.nome &&
          usuario.nome.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : [];

  const usuariosExibidos = filtroUsuarios.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(filtroUsuarios.length / itensPorPagina);

  const mudarPagina = (novaPagina) => {
    if (novaPagina > 0 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const MySwal = withReactContent(Swal);

  const excluirCliente = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Tem certeza?",
        text: "Você deseja excluir este cliente? Esta ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Não, cancelar!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            Swal.fire({
              title: "Excluindo...",
              text: "Aguarde enquanto processamos sua solicitação.",
              icon: "info",
              showConfirmButton: false,
              
              owOutsideClick: false,
            });
            const res = await apiAcai.delete(`/client/del/${id}`);
            if (res.status === 200) {
              setUsuarios((prevUsuarios) =>
                prevUsuarios.filter((user) => user.id !== id)
              );
              swalWithBootstrapButtons.fire({
                title: "Excluído!",
                text: "O cliente foi excluído com sucesso.",
                icon: "success",
              });
            } else {
              swalWithBootstrapButtons.fire({
                title: "Erro!",
                text: "Não foi possível excluir o cliente.",
                icon: "error",
              });
            }
          } catch (error) {
            console.error(error);
            swalWithBootstrapButtons.fire({
              title: "Erro!",
              text: "Ocorreu um erro ao tentar excluir o cliente.",
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "A exclusão foi cancelada. O cliente está seguro.",
            icon: "error",
          });
        }
      });
  };

  const mostrarMensagemSucesso = (tipo) => {
    MySwal.fire({
      title: "Sucesso!",
      text: `Mensagem de ${tipo} enviada com sucesso.`,
      icon: "success",
      confirmButtonText: "OK",
    });
  };
  const mostrarOpcoesWhatsApp = async (telefone, id) => {
    MySwal.fire({
      title: "Escolha uma opção",
      text: "O que você deseja reenviar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Reenviar Boas-vindas",
      cancelButtonText: "Reenviar Saldo Cashback",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await apiAcai.post("/int/wpp/welcome", { telefone });
          if (res.status === 201) {
            Swal.fire({
              title: "Enviando...",
              text: "Estamos reenviando a mensagem de boas-vindas. Por favor, aguarde.",
              icon: "info",
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2000,
              willClose: () => mostrarMensagemSucesso("boas-vindas"),
            });
          }
        } catch (error) {
          console.error(error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        try {
          const res = await apiAcai.post("/int/wpp/cashback", { id });
          if (res.status === 201) {
            Swal.fire({
              title: "Enviando...",
              text: "Estamos reenviando a mensagem de saldo cashback. Por favor, aguarde.",
              icon: "info",
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2000,
              willClose: () => mostrarMensagemSucesso("saldo cashback"),
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  return (
    <>
      <GlobalStyle />
      <Flex>
        <ContainerFlex>
          <NavBar>
            <InputPesquisa
              type="search"
              placeholder="Digite o nome do cliente"
              value={pesquisa}
              onChange={handlePesquisaChange}
            />
           <InputButao type="button" value="+ Cliente" onClick={() => setMostrarModal(true)} /> 
           <ModalCadastroUsuario
            isOpen={mostrarModal}
            onRequestClose={() => setMostrarModal(false)}
            onSuccess={() => {
              
            }}
          />
          </NavBar>
          {/* <Modal
            isOpen={modalAberto}
            onRequestClose={fecharModal}
            contentLabel="Confirmar Pedido"
            style={{
              content: {
                borderRadius: "15px",
                maxWidth: "60%",
                height: "50%",
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
            <form onSubmit={(e) => cadastrarUsuario(e)}>
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
                    mask="999.999.999-99"
                    type="text"
                    placeholder="CPF do cliente"
                    value={cpf}
                    onChange={handleChange}
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
                  <input
                    type="submit"
                    value="Cadastrar cliente"
                    disabled={enviando}
                  />
                )}
              </ButaoEnvioUsuario>
            </form>
          </Modal> */}

          <Tabela>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Editar Cliente</th>
                <th>Excluir Cliente</th>
                <th>Reenviar Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {usuariosExibidos.map((usuario) => (
                <tr key={usuario.cpf}>
                  <td>{usuario.nome}</td>
                  <td>{formatarCPF(usuario.cpf)}</td>
                  <td>{formatarTelefone(usuario.telefone)}</td>
                  <td>
                    <HiOutlinePencilSquare
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setModalEditarCliente(true);
                        setName(usuario.nome);
                        setCpf(usuario.cpf);
                        setTelefone(usuario.telefone);
                        setId(usuario.id);
                      }}
                    />
                  </td>
                  <td>
                    <MdDelete
                      onClick={() => excluirCliente(usuario.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <FaWhatsappSquare
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        mostrarOpcoesWhatsApp(usuario.telefone, usuario.id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Tabela>
          <Modal
            isOpen={modalEditarCliente}
            onRequestClose={fecharModalEditor}
            contentLabel="Confirmar Pedido"
            style={{
              content: {
                borderRadius: "15px",
                maxWidth: "60%",
                height: "50%",
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
              <h2>Editor de Cliente</h2>
            </ModalCadastroProduto>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                atualizarCliente(id, name, cpf, telefone);
              }}
            >
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
                    mask="999.999.999-99"
                    type="text"
                    placeholder="CPF do cliente"
                    value={cpf}
                    onChange={handleChange}
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
                  <input
                    type="submit"
                    value="Atualizar Cliente"
                    disabled={enviando}
                  />
                )}
              </ButaoEnvioUsuario>
            </form>
          </Modal>
          <Paginacao>
            <PaginacaoBotao
              onClick={() => mudarPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              Anterior
            </PaginacaoBotao>
            <PaginacaoBotao
              onClick={() => mudarPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
            </PaginacaoBotao>
          </Paginacao>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Usuarios;
