import styled, { createGlobalStyle } from "styled-components";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config.js";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Swal from "sweetalert2";

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
  background-color: #73287d;
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

const InputButao = styled.input`
  min-width: 19%;
  border-radius: 10px;
  height: 50px;
  padding-left: 10px;
  border: none;
  color: #5f387a;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
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
    color: #73287d;
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
  padding: 50px;
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
const Mesas = () => {
  const [mesas, setMesas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [id, setId] = useState("");
  const [referencia, setReferencia] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [modalEditarCliente, setModalEditarCliente] = useState("");

  useEffect(() => {
    const carregarMesas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiAcai.get("/table/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMesas(res.data.message);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarMesas();
  }, []);

  const abrirModal = () => {
    setModalAberto(true);
  };
  const fecharModal = () => {
    setModalAberto(false);
  };

  const fecharModalEditor = () => {
    setId("");
    setReferencia("");
    setId("");
    setModalEditarCliente(false);
  };

  const cadastrarMesa = async (e) => {
    e.preventDefault();

    if (!id.trim()) {
      toast.error("Por favor, preencha o ID.");
      return;
    }

    if (!referencia.trim()) {
      toast.error("Por favor, preencha a refêrencia.");
      return;
    }

    const dados = { id, referencia };

    setEnviando(true);

    try {
      const res = await apiAcai.post("/table/create", dados);
      if (res.status === 200) {
        toast.success("Mesa cadastrada com sucesso");
        window.location.reload();
        fecharModal();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar mesa");
    } finally {
      setEnviando(false);
    }
  };

  const excluirMesa = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Aviso",
        text: "Você realmente deseja excluir essa mesa? Esta ação não pode ser desfeita.",
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
            const res = await apiAcai.delete(`/table/dell/${id}`);
            if (res.status === 200) {
              setMesas((prevMesas) =>
                prevMesas.filter((mesa) => mesa.id !== id)
              );
              swalWithBootstrapButtons.fire({
                title: "Excluído!",
                text: "Mesa excluída com sucesso.",
                icon: "success",
              });
            } else {
              swalWithBootstrapButtons.fire({
                title: "Erro!",
                text: "Não foi possível excluir a mesa.",
                icon: "error",
              });
            }
          } catch (error) {
            console.error(error);
            swalWithBootstrapButtons.fire({
              title: "Erro!",
              text: "Ocorreu um erro ao tentar excluir a mesa.",
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "A exclusão foi cancelada. Sua mesa está segura.",
            icon: "error",
          });
        }
      });
  };

  return (
    <>
      <GlobalStyle />
      <Flex>
        <ContainerFlex>
          <NavBar>
            <InputButao
              type="button"
              onClick={abrirModal}
              value="Cadastrar Mesa"
            />
            <Modal
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
                <h2>Cadastro de Mesa</h2>
              </ModalCadastroProduto>
              <form onSubmit={(e) => cadastrarMesa(e)}>
                <Form>
                  <Form1>
                    <label>id</label>
                    <input
                      type="text"
                      placeholder="Número da mesa"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Refêrencia</label>
                    <input
                      type="text"
                      placeholder="Referência da mesa"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </Form1>
                </Form>
                <ButaoEnvioUsuario>
                  {enviando ? (
                    <Spinner />
                  ) : (
                    <input
                      type="submit"
                      value="Cadastrar mesa"
                      disabled={enviando}
                    />
                  )}
                </ButaoEnvioUsuario>
              </form>
            </Modal>
          </NavBar>
          <Tabela>
            <thead>
              <tr>
                <th>ID</th>
                <th>Referência</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((mesa) => (
                <tr key={mesa.id}>
                  <td>{mesa.id}</td>
                  <td>{mesa.Referencia}</td>
                  <td>
                    <HiOutlinePencilSquare
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setModalEditarCliente(true);
                        setId(mesa.id);
                        setReferencia(mesa.Referencia);
                      }}
                    />
                  </td>
                  <td>
                    <MdDelete
                      onClick={() => excluirMesa(mesa.id)}
                      style={{ cursor: "pointer" }}
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
              <h2>Editor Mesas</h2>
            </ModalCadastroProduto>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                atualizarCliente(id, referencia);
              }}
            >
              <Form>
                <Form1>
                  <label>ID</label>
                  <input
                    type="text"
                    placeholder="Número da mesa"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </Form1>
                <Form1>
                  <label>Referencia</label>
                  <input
                    type="text"
                    placeholder="Refêrencia da mesa"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                  />
                </Form1>
              </Form>
              <ButaoEnvioUsuario>
                {enviando ? (
                  <Spinner />
                ) : (
                  <input
                    type="submit"
                    value="Atualizar Mesa"
                    disabled={enviando}
                  />
                )}
              </ButaoEnvioUsuario>
            </form>
          </Modal>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Mesas;
