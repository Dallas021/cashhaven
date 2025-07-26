import styled, { createGlobalStyle } from "styled-components";
import { useState, useEffect, useRef } from "react";
import apiAcai from "../axios/config.js";
import Modal from "react-modal";
import * as yup from "yup";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaWhatsappSquare } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InputButao from "../componentes/botao/InputBotao.jsx";
import { MdAddCircleOutline } from "react-icons/md";
import SetaFechar from "../componentes/SetaFechar.jsx";

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
const ButaoEnvioProduto = styled.div`
  display: flex;
  margin-top: 1.5%;
  justify-content: center;
  input {
    background-color: #712976;
    color: #f3eef7;
    padding: 15px 50px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
  }
  input:hover {
    background-color: #712976;
    border: none;
    transition: 1s;
  }
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
    background-color: #712976;
    color: #fff;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
`;

const ModalCadastroProduto = styled.div`
  background-color: #712976;
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
    color: #712976;
    font-weight: 700;
    font-size: 20px;
  }
  input {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #712976;
  }
`;
const Form1 = styled.div`
  display: flex;
  flex-direction: column;
`;
const SelectEstilizado = styled.select`
  margin-left: 20px;
  width: 280px;
  height: 45px;
  padding-left: 10px;
  border-radius: 20px;
  border: 1px solid #290d3c;
  color: #46295a;
  font-weight: 700;
  font-size: 20px;
  margin-right: 25px;
`;

const OptionEstilizado = styled.option`
  color: #46295a;
  font-weight: 700;
  font-size: 20px;
`;

const ButaoEnvioUsuario = styled.div`
  display: flex;
  margin-top: 1.5%;
  justify-content: center;
  input {
    background-color: #712976;
    color: #f3eef7;
    padding: 15px 50px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
  }
  input:hover {
    background-color: #712976;
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
const FormAdd = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  input,
  label {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #46295a;
    font-weight: 700;
    font-size: 20px;
  }
  input {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #290d3c;
  }
  .img-produto {
    width: 600px;
  }
`;
const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [produto, setProduto] = useState("");
  const [id, setId] = useState("");
  const [saldo, setSaldo] = useState("");
  const [ncm, setNcm] = useState("");
  const [cest, setCest] = useState("");
  const [preco_custo, setPreco_custo] = useState("");
  const [venda, setVenda] = useState("");
  const [compra, setCompra] = useState("");
  const [nome, setNome] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  // const [preco_venda, setPreco_venda] = useState("");
  // const [ultimo_fonecedor, setUltimo_fonecedor] = useState("");
  const [deletarProduto, setDeletarProduto] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalEditarCliente, setModalEditarCliente] = useState("");
  const [modalAddProduto, setModalAddProduto] = useState("");
  const [produtosOriginais, setProdutosOriginais] = useState([]);
  const [categoria, setCategoria] = useState(0);
  const quantidadeRef = useRef(null);
  const valorRef = useRef(null);
  const fornecedorRef = useRef(null);
  const fecharModalAddProduto = () => {
    setModalAddProduto(false);
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (parseFloat(numericValue) / 100).toFixed(2);
    return formattedValue.replace(",", ".");
  };
  const valorPrecoVendaEd = (e) => {
    const inputValue = e.target.value;
    setVenda(formatCurrency(inputValue));
  };

  const valorPrecoVenda = (e) => {
    const inputValue = e.target.value;
    setVenda(formatCurrency(inputValue));
  };
  const valorPrecoCompra = (e) => {
    const inputValue = e.target.value;
    setCompra(formatCurrency(inputValue));
  };

  const atualizarProduto = async (e) => {
    e.preventDefault();
    try {
      const produtoEditado = {
        id,
        nome,
        venda,
      };
      const res = await apiAcai.put("stock/update/product", produtoEditado);
      if (res.status === 200) {
        toast.success("Produto atualizado com sucesso!");
        fecharModalEditor();
      } else {
        toast.error("Erro ao atualizar produto!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar produto!");
    }
  };

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await apiAcai.get("/stock/all", {});
        setProdutos(res.data.message);
        setProdutosOriginais(res.data.message);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarProdutos();
  }, []);

  const valorModalAddSaldo = (saldo, id, compra, fornecedor, nome) => {
    setSaldo(saldo);
    setId(id);
    setCompra(compra);
    setFornecedor(fornecedor);
    setNome(nome);

    setModalAddProduto(true);
  };

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
    setNome("");
    setVenda("");
    setSaldo("");
    setId("");
    setModalEditarCliente(false);
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();

    if (!produto.trim()) {
      toast.error("Por favor, preencha o nome do produto.");
      return;
    }

    if (!compra.trim()) {
      toast.error("Por favor, preencha o preço do compra.");
      return;
    }
    if (!venda.trim()) {
      toast.error("Por favor, preencha o preço de venda.");
      return;
    }
    if (!fornecedor.trim()) {
      toast.error("Por favor, preencha o fornecedor.");
      return;
    }
    if (!saldo.trim()) {
      toast.error("Por favor, preencha o campo.");
      return;
    }
    if (!ncm.trim()) {
      toast.error("Por favor, preencha o ncm.");
      return;
    }
    if (!cest.trim()) {
      toast.error("Por favor, preencha o cest.");
      return;
    }
    try {
      setEnviando(true);
      const produtosIseridos = {
        produto,
        compra,
        venda,
        fornecedor,
        saldo,
        ncm,
        cest,
      };
      const res = await apiAcai.post("/stock/insert", produtosIseridos);
      if (res.status === 200) {
        window.location.reload();
        fecharModal();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEnviando(false);
    }
  };
  const handlePesquisaChange = (e) => {
    const termoPesquisa = e.target.value;
    setPesquisa(termoPesquisa);
    filtrarProdutos(termoPesquisa);
  };

  const filtrarProdutos = (termoPesquisa) => {
    if (!termoPesquisa) {
      setProdutos(produtosOriginais);
    } else {
      const produtosFiltrados = produtosOriginais.filter((produto) =>
        produto.produto.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
      setProdutos(produtosFiltrados);
    }
  };

  const itensPorPagina = 11;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;

  const filtroProdutos = Array.isArray(produtos)
    ? produtos.filter(
        (produto) =>
          produto.produto &&
          produto.produto.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : [];

  const produtosExibidos = filtroProdutos.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(filtroProdutos.length / itensPorPagina);

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
        text: "Você deseja excluir este produto? Esta ação não pode ser desfeita.",
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
              allowOutsideClick: false,
            });
            const res = await apiAcai.delete(`/stock/delete/${id}`);
            if (res.status === 200) {
              setProdutos((prevProdutos) =>
                prevProdutos.filter((produto) => produto.id !== id)
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

  const adicionarSaldo = async (e) => {
    e.preventDefault();

    if ((saldo ?? "").trim() === "") {
      toast.error("Por favor, preencha o saldo do produto.");
      return;
    }
    try {
      const produtoEviando = {
        id,
        saldo,
        fornecedor,
        compra,
      };
      const res = await apiAcai.post("/stock/update/sd", produtoEviando);
      if (res.status === 200) {
        fecharModalAddProduto();
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Flex>
        <ContainerFlex>
          <NavBar>
            <InputPesquisa
              type="search"
              placeholder="Digite o nome do produto"
              value={pesquisa}
              onChange={handlePesquisaChange}
            />
            <InputButao type="button" value="+ Produto" onClick={abrirModal} />
          </NavBar>
          <Modal
            isOpen={modalAberto}
            onRequestClose={fecharModal}
            contentLabel="Confirmar Pedido"
            style={{
              content: {
                borderRadius: "15px",
                maxWidth: "60%",
                height: "70%",
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
              <h2>Cadastro de Produto</h2>
            </ModalCadastroProduto>
            <form onSubmit={(e) => cadastrarProduto(e)}>
              <Form>
                <Form1>
                  <label>Nome do Produto</label>
                  <input
                    type="text"
                    placeholder="Nome do Produto"
                    value={produto}
                    onChange={(e) => setProduto(e.target.value)}
                  />
                </Form1>
                <Form1>
                  <label>Preço de Compra</label>
                  <input
                    type="text"
                    placeholder="Preço de Compra"
                    value={compra}
                    onChange={valorPrecoCompra}
                  />
                </Form1>
              </Form>
              <Form>
                <Form1>
                  <label>Preço de Venda</label>
                  <input
                    type="text"
                    placeholder="Preço de Venda"
                    value={venda}
                    onChange={valorPrecoVenda}
                  />
                </Form1>
                <Form1>
                  <label>Fornecedor</label>
                  <input
                    type="text"
                    placeholder="Nome do Fornecedor"
                    value={fornecedor}
                    onChange={(e) => setFornecedor(e.target.value)}
                  />
                </Form1>
              </Form>
              <Form>
                <Form1>
                  <label>NCM</label>
                  <input
                    type="text"
                    placeholder="NCM do produto"
                    value={ncm}
                    onChange={(e) => setNcm(e.target.value)}
                  />
                </Form1>
                <Form1>
                  <label>CEST</label>
                  <input
                    type="text"
                    placeholder="CEST do produto"
                    value={cest}
                    onChange={(e) => setCest(e.target.value)}
                  />
                </Form1>
              </Form>
              <Form>
                <Form1>
                  <label>Categoria</label>
                  <SelectEstilizado
                    value={categoria}
                    onChange={(e) => setCategoria(parseInt(e.target.value))}
                  >
                    <OptionEstilizado value={0}>Quilo</OptionEstilizado>
                    <OptionEstilizado value={1}>Quantidade</OptionEstilizado>
                  </SelectEstilizado>
                </Form1>
                <Form1>
                  <label>{categoria === 0 ? "Quilo" : "Quantidade"}</label>
                  <input
                    type="number"
                    placeholder={`${
                      categoria === 0
                        ? "Quantidade em quilos"
                        : "Quantidade de produto"
                    }`}
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                  />
                </Form1>
              </Form>
              <ButaoEnvioUsuario>
                {enviando ? (
                  <Spinner />
                ) : (
                  <input
                    type="submit"
                    value="Cadastrar produto"
                    disabled={enviando}
                  />
                )}
              </ButaoEnvioUsuario>
            </form>
          </Modal>

          <Tabela>
            <thead>
              <tr>
                <th>Codigo do Produto</th>
                <th>Nome do Produto</th>
                <th>Saldo do Produto</th>
                <th>Preço de Custo</th>
                <th>Preço de Venda</th>
                <th>Ultimo Forneceodr</th>
                <th>Editar Produto</th>
                <th>Excluir </th>
                <th>Adicionar Saldo</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.produto}</td>
                  <td>{produto.saldo}</td>
                  <td>{produto.preco_custo}</td>
                  <td>{produto.preco_venda}</td>
                  <td>{produto.ultimo_fonecedor}</td>
                  <td>
                    <HiOutlinePencilSquare
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setModalEditarCliente(true);
                        setNome(produto.produto);
                        setId(produto.id);
                        setSaldo(produto.saldo);
                        setPreco_custo(produto.preco_custo);
                        setVenda(produto.preco_venda);
                      }}
                    />
                  </td>
                  <td>
                    <MdDelete
                      onClick={() => excluirCliente(produto.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>

                  <td>
                    <MdAddCircleOutline
                      onClick={() =>
                        valorModalAddSaldo(
                          produto.saldo,
                          produto.id,
                          produto.compra,
                          produto.nome,
                          produto.fornecedor
                        )
                      }
                      color="#46295a"
                      size={30}
                      style={{ cursor: "pointer" }}
                    />
                    <Modal
                      isOpen={modalAddProduto}
                      onRequestClose={fecharModalAddProduto}
                      style={{
                        content: {
                          maxWidth: "50%",
                          maxHeight: "40%",
                          margin: "auto",
                          padding: 0,
                        },
                      }}
                    >
                      <div className="modal-mensagem margin-msg">
                        <SetaFechar Click={fecharModalAddProduto} />
                        <h2>Adicionar Produto</h2>
                      </div>
                      <FormAdd>
                        <Form1>
                          <label>Código</label>
                          <input
                            type="number"
                            onChange={(e) => {
                              setId(e.target.value);
                            }}
                            value={id}
                            disabled
                          />
                        </Form1>
                        <Form1>
                          <label>Saldo</label>
                          <input
                            ref={valorRef}
                            type="number"
                            placeholder="Quantidade de produto"
                            value={saldo}
                            onChange={(e) => {
                              setSaldo(e.target.value);
                              setTimeout(() => {
                                valorRef.current.focus();
                              }, 0);
                            }}
                          />
                        </Form1>
                      </FormAdd>
                      <ButaoEnvioProduto>
                        {enviando ? (
                          "Aguarde..."
                        ) : (
                          <input
                            type="submit"
                            value="Salvar"
                            disabled={enviando}
                            onClick={(e) => {
                              adicionarSaldo(e);
                            }}
                          />
                        )}
                      </ButaoEnvioProduto>
                    </Modal>
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
              <h2>Editor de Produto</h2>
            </ModalCadastroProduto>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                atualizarProduto(e);
              }}
            >
              <Form>
                <Form1>
                  <label>Produto</label>
                  <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </Form1>
                <Form1>
                  <label>Preço de Venda</label>
                  <input
                    type="text"
                    placeholder="Preço de Venda"
                    value={venda}
                    onChange={valorPrecoVenda}
                  />
                </Form1>
              </Form>

              <ButaoEnvioUsuario>
                {enviando ? (
                  <Spinner />
                ) : (
                  <input
                    type="submit"
                    value="Atualizar Produto"
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

export default Estoque;
