import styled, { createGlobalStyle } from "styled-components";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config.js";
import { FaPenToSquare } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import Modal from "react-modal";
import SetaFechar from "../componentes/SetaVoltar.jsx";

const Header = styled.div`
  color: #73287d;
  padding: 15px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  width: 100%;
`;

const FormEmp = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #73287d;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #73287d;
  border-radius: 10px;
  font-size: 16px;
  color: #73287d;
  background: #fff;
  &:disabled {
    background: #f3eef7;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Josefin Sans', serif;
    margin: 0;
    padding: 0;
    @media screen and (max-width: 900px) {
      background: #fff;
    }
  }
`;

const ModalEdicaoEmpresa = styled.div`
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
  label,
  select {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #73287d;
    font-weight: 700;
    font-size: 20px;
  }
  input,
  select {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #73287d;
  }
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
const Tabela2 = styled.table`
  width: 95%;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;

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
    background-color: #efe8f0;
    color: #712976;
  }
`;

const IconeEditavel = styled(FaPenToSquare)`
  cursor: pointer;
`;
const IconeConfig = styled(MdOutlineSettings)`
  cursor: pointer;
`;

const ModalMensagem = styled.div`
  background-color: #712976;
  height: 40px;
  flex-direction: column;
  width: 100%;
  display: flex;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  justify-content: space-between;
  gap: 30%;

  @media (max-width: 900px) {
    font-size: 10px;
  }
`;

const ModalInfo = styled.div`
  display: flex;
  justify-content: center;

  input,
  label,
  select {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #712976;
    font-weight: 700;
    font-size: 20px;
  }
  input,
  select {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #712976;
  }
`;

const Form2 = styled.div`
  display: flex;
  flex-direction: column;
  input {
    width: 350px;
  }
`;
const Form3 = styled.div`
  display: flex;
  flex-direction: column;
  input {
    width: 70px;
  }
`;
const Form1 = styled.div`
  display: flex;
  flex-direction: column;
`;
const BotaoAdd = styled.input`
  background-color: #712976;
  cursor: pointer;
  color: #fff;
  border: none;
  height: 29px;
  width: 170px;
`;
const BotaoAddImp = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  margin-bottom: 20px;
  width: 95%;
  button {
    background-color: #712976;
    cursor: pointer;
    color: #fff;
    border: none;
    height: 40px;
    width: 170px;
    border-radius: 10px;
  }
`;
const Button = styled.button`
  background-color: #712976;
  color: #fff;
  border: none;
  height: 40px;
  margin-top: 20px;
  width: 170px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #5c1e63;
  }
`;
export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border || "#ccc"};
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  background-color: ${({ theme }) => theme.colors.background || "#fff"};
  color: ${({ theme }) => theme.colors.text || "#000"};
  margin-top: 5px;
  margin-bottom: 10px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary || "#007bff"};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;

export const Option = styled.option`
  padding: 10px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.background || "#fff"};
  color: ${({ theme }) => theme.colors.text || "#000"};
`;
const Parametros = () => {
  const [sdmin, setSdmin] = useState("");
  const [vendaManual, setVendaManual] = useState("");
  const [gXv, setGXv] = useState("");
  const [point, setPoint] = useState("");
  const [empresa, setEmpresa] = useState(null);
  const [parametroSelecionado, setParametroSelecionado] = useState(null);
  const [modalEmpresa, setModalEmpresa] = useState("");
  const [modalPdv, setModalPdv] = useState("");
  const [modalImpressora, setModalImpressora] = useState("");
  //const [valor, setValor] = useState([]);
  const [modalPercetual, setModalPercetual] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [impressoras, setImpressoras] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [formData, setFormData] = useState({
    ip: "",
    model: "",
  });
  useEffect(() => {
    const buscarModelos = async () => {
      try {
        const res = await apiAcai.get("/imp/all/models");
        setModelos(res.data.message);
      } catch (error) {
        console.error("Erro ao buscar modelos:", error);
      }
    };

    buscarModelos();
  }, []);
  useEffect(() => {
    apiAcai
      .get("/imp/all/")
      .then((response) => {
        setImpressoras(response.data.message);
      })
      .catch((error) => {
        console.error("Erro ao buscar impressoras:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ip: formData.ip,
        model: Number(formData.model),
      };

      const response = await apiAcai.post("/imp/register", payload);

      setFormData({ ip: "", model: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar impressora:", error);
    }
  };

  const fecharModalEmpresa = () => {
    setModalEmpresa(false);
  };
  const fecharModalPdv = () => {
    setModalPdv(false);
  };

  const abrirModalEditar = (parametro) => {
    if (parametro.id === 1) {
      alert("Não é possível modificar o parâmetro de licença");
      return;
    }
    setParametroSelecionado(parametro);
    setModalPercetual(true);
  };

  const fecharModalEditar = () => {
    setModalPercetual(false);
    setParametroSelecionado(null);
  };

  const fecharModalImpressora = () => {
    setModalImpressora(false);
  };

  const atualizarParametro = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await apiAcai.put(
        "/param/update",
        { ...parametroSelecionado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  // useEffect(() => {
  //   const carregarParametros = async () => {
  //     try {
  //       const res = await apiAcai.get("/param/all");
  //       console.log("Sucesso", res.data.message[2].bit);
  //       setCashback(res.data.message[2].bit);
  //     } catch (error) {
  //       console.log("Erro", error);
  //     }
  //   };
  //   carregarParametros();
  // }, []);

  useEffect(() => {
    const carregandoDadosEmpresa = async () => {
      try {
        const res = await apiAcai.get("company/all");
        if (res.data.length > 0) {
          setEmpresa(res.data);
        }
        setEmpresa(res.data.message[0]);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
    carregandoDadosEmpresa();
  }, []);

  useEffect(() => {
    const carregarParametros = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiAcai.get("param/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSdmin(res.data.message[5].valor);
        setPoint(res.data.message[1].valor);
        setVendaManual(res.data.message[9].bit);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarParametros();
  }, []);

  useEffect(() => {
    const carregarConfigEmpresa = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiAcai.get("company/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParametros(res.data.message);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarConfigEmpresa();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Tabela>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01</td>
            <td>Configuração de empresa</td>
            <td>
              <IconeEditavel
                color="rgba(108, 45, 78, 255)"
                onClick={() => {
                  setModalEmpresa(true);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>02</td>
            <td>Configuração de PDV</td>
            <td>
              <IconeEditavel
                color="rgba(108, 45, 78, 255)"
                onClick={() => {
                  setModalPdv(true);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>03</td>
            <td>Configuração de Impressora</td>
            <td>
              <IconeConfig
                color="rgba(108, 45, 78, 255)"
                onClick={() => {
                  setModalImpressora(true);
                }}
              />
            </td>
          </tr>
        </tbody>
      </Tabela>

      <Modal
        isOpen={modalPercetual}
        onRequestClose={fecharModalEditar}
        contentLabel="Editar Parâmetro"
        style={{
          content: {
            width: "70%",
            height: "50%",
            margin: "auto",
            padding: "0",
          },
        }}
      >
        {parametroSelecionado && (
          <>
            <ModalMensagem>
              <SetaFechar Click={fecharModalEditar} />
            </ModalMensagem>
            <ModalInfo>
              <Form1>
                <label>ID</label>
                <input type="text" value={parametroSelecionado.id} disabled />
                <label>Nome</label>
                <input
                  type="text"
                  disabled
                  value={parametroSelecionado.parametro}
                  onChange={(e) =>
                    setParametroSelecionado({
                      ...parametroSelecionado,
                      parametro: e.target.value,
                    })
                  }
                />
              </Form1>
              <Form1>
                <label>Valor</label>
                <input
                  type="number"
                  value={parametroSelecionado.valor || ""}
                  onChange={(e) =>
                    setParametroSelecionado({
                      ...parametroSelecionado,
                      valor: e.target.value,
                    })
                  }
                />
                <label>Status</label>
                <select
                  value={parametroSelecionado.bit}
                  onChange={(e) =>
                    setParametroSelecionado({
                      ...parametroSelecionado,
                      bit: e.target.value,
                    })
                  }
                >
                  <option value={1}>Ativo</option>
                  <option value={0}>Inativo</option>
                </select>
              </Form1>
            </ModalInfo>
            <ModalInfo>
              <BotaoAdd
                type="button"
                value="Atualizar"
                onClick={atualizarParametro}
                style={{
                  marginTop: "20px",
                  marginLeft: "50px",
                  color: "white",
                }}
              />
            </ModalInfo>
          </>
        )}
      </Modal>
      <Modal
        isOpen={modalEmpresa}
        onRequestClose={fecharModalEmpresa}
        contentLabel="Confirmar Pedido"
        style={{
          content: {
            borderRadius: "40px",
            maxWidth: "50%",
            height: "90%",
            margin: "auto",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 0 10px rgb(0 0 0 / 67%)",
          },
        }}
      >
        <Header>
          <h2>Configuração de Empresa</h2>
        </Header>
        {empresa ? (
          <>
            <FormEmp>
              <FormGroup>
                <Label>ID</Label>
                <Input type="number" value={empresa.id} disabled />
              </FormGroup>
              <FormGroup>
                <Label>Razão Social</Label>
                <Input type="text" value={empresa.razao_social} disabled />
              </FormGroup>
            </FormEmp>
            <FormEmp>
              <FormGroup>
                <Label>CNPJ</Label>
                <Input type="text" value={empresa.cnpj} disabled />
              </FormGroup>
              <FormGroup>
                <Label>IE</Label>
                <Input type="text" value={empresa.ie} disabled />
              </FormGroup>
            </FormEmp>
            <FormEmp>
              <FormGroup>
                <Label>Bairro</Label>
                <Input type="text" value={empresa.bairro} disabled />
              </FormGroup>
              <FormGroup>
                <Label>Endereço</Label>
                <Input type="text" value={empresa.endereco} disabled />
              </FormGroup>
            </FormEmp>
            <FormEmp>
              <FormGroup>
                <Label>Cidade</Label>
                <Input type="text" value={empresa.cidade} disabled />
              </FormGroup>
              <FormGroup>
                <Label>Estado</Label>
                <Input type="text" value={empresa.estado} disabled />
              </FormGroup>
            </FormEmp>
            <FormEmp>
              <FormGroup>
                <Label>T1</Label>
                <Input type="text" value={empresa.t1} disabled />
              </FormGroup>
              <FormGroup>
                <Label>T2</Label>
                <Input type="text" value={empresa.t2} disabled />
              </FormGroup>
            </FormEmp>
            <FormEmp>
              <FormGroup>
                <Label>T3</Label>
                <Input type="text" value={empresa.t3} disabled />
              </FormGroup>
              <FormGroup>
                <Label>T4</Label>
                <Input type="text" value={empresa.t4} disabled />
              </FormGroup>
            </FormEmp>
          </>
        ) : (
          <p>Carregando dados da empresa...</p>
        )}
      </Modal>
      <Modal
        isOpen={modalImpressora}
        onRequestClose={fecharModalImpressora}
        contentLabel="Confirmar Pedido"
        style={{
          content: {
            borderRadius: "15px",
            maxWidth: "80%",
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
        <ModalEdicaoEmpresa>
          <h2>Configuração de Impressora</h2>
        </ModalEdicaoEmpresa>
        <Tabela2>
          <thead>
            <tr>
              <th>ID</th>
              <th>IP</th>
              <th>Modelo</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
            <tr></tr>
            {impressoras.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.ip}</td>
                <td>{item.id_model}</td>
              </tr>
            ))}
          </tbody>
        </Tabela2>
        <BotaoAddImp>
          <button onClick={() => setIsModalOpen(true)}>
            + Adicionar Impressora
          </button>
        </BotaoAddImp>
      </Modal>
      <Modal
        isOpen={modalPdv}
        onRequestClose={fecharModalPdv}
        contentLabel="Confirmar Pedido"
        style={{
          content: {
            borderRadius: "15px",
            maxWidth: "80%",
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
        <ModalEdicaoEmpresa>
          <h2>Configuração de PDV</h2>
        </ModalEdicaoEmpresa>

        <Form>
          <Form1>
            <label>Saldo mínimo para resgate</label>
            <input value={sdmin} type="text" />
          </Form1>
          <Form1>
            <label>Desativar/Ativar venda manual</label>
            <select value={vendaManual}>
              <option value={1}>Ativo</option>
              <option value={0}>Inativo</option>
            </select>
          </Form1>
          <Form1>
            <label>Percentual cashback</label>
            <input value={point} type="text" />
          </Form1>
        </Form>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Adicionar Impressora"
        style={{
          content: {
            borderRadius: "15px",
            maxWidth: "50%",
            height: "35%",
            margin: "auto",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 0 10px rgb(0 0 0 / 67%)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        {" "}
        <ModalEdicaoEmpresa>
          <h2>Adicionar Impressora</h2>
        </ModalEdicaoEmpresa>
        <ModalInfo>
          <FormGroup>
            <Label htmlFor="ip">IP da Impressora</Label>
            <Input
              type="text"
              name="ip"
              id="ip"
              value={formData.ip}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="model">Modelo</Label>
            <Select name="model" value={formData.model} onChange={handleChange}>
              <Option value="">Selecione</Option>
              {modelos.map((modelo) => (
                <Option key={modelo.id} value={modelo.id}>
                  {modelo.ref}
                </Option>
              ))}
            </Select>
          </FormGroup>
        </ModalInfo>
        <Button onClick={handleSubmit}>Salvar Impressora</Button>
      </Modal>
    </>
  );
};

export default Parametros;
