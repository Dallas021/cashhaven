import styled, { createGlobalStyle } from "styled-components";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config";
import { padding } from "@mui/system";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import ModalEdicaoImpressora from "../componentes/ModalImpressora";
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  padding: 2rem;
  font-family: Arial, Helvetica, sans-serif;
  width: 1000px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  
`;

const Tab = styled.button`
  padding: 10px 90px;
  font-weight: bold;
  color: #73287d;
  background: ${({ active }) => (active ? "#f3eef7" : "transparent")};
  border: 2px solid #73287d;
  border-bottom: ${({ active }) => (active ? "none" : "2px solid #73287d")};
  cursor: pointer;
  border-radius: 10px 10px 0 0;
`;

const Form = styled.div`
  background: #fff;
  padding: 2rem;
  border: 2px solid #73287d;
  border-radius: 0 0 10px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

const FormImpressao = styled.div`
  background: #fff;
  padding: 2rem;
  border: 2px solid #73287d;
  border-radius: 0 0 10px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.2rem;

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

const Linha = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const LinhaImpressora = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const BotaoSalvar = styled.button`
  padding: 0.7rem 2rem;
  background: #73287d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #5a2060;
  }
`;


const Parametros = () => {
  const [abaAtual, setAbaAtual] = useState("empresa");
  const [vendaManual, setVendaManual] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [endereco, setEndereco] = useState("")
  const [estado, setEstado] = useState("")
  const [razao, setRazao] = useState("")
  const [IE, setIE] = useState("")
  const [ipPrincipal, setIpPrincipal] = useState("")
  const [modeloImpressora, setModeloImpressora] = useState("")
  const [modalAberta, setModalAberta] = useState(false);
  const [sdmin, setSdmin] = useState("");
  const [point, setPoint] = useState("");

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
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
        }
      };
      carregandoDadosEmpresa();
    }, []);

    useEffect(() => {
      const carregandoImpressoraPrincipal = async () => {
        try {
          const res = await apiAcai.get("/imp/primary");
          setIpPrincipal(res.data.ip)
          setModeloImpressora(res.data.model)
          console.log(res)
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
        }
      };
      carregandoImpressoraPrincipal();
    }, []);


    //CONFIGURAÇÃO PDV

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
            setPoint(res.data.message[2].valor);
            setVendaManual(res.data.message[9].bit);
          } catch (error) {
            console.log("Erro", error);
          }
        };
        carregarParametros();
      }, []);

      
  return (
    <>
      <GlobalStyle />
      <Container>
        <h2 style={{ color: "#73287d", marginBottom: "20px" }}>PARÂMETROS</h2>
        <Tabs>
          <Tab active={abaAtual === "empresa"} onClick={() => setAbaAtual("empresa")}>
            Configuração Empresa
          </Tab>
          <Tab active={abaAtual === "pdv"} onClick={() => setAbaAtual("pdv")}>
            Configuração PDV
          </Tab>
          <Tab active={abaAtual === "impressora"} onClick={() => setAbaAtual("impressora")}>
            Configuração Impressora
          </Tab>
        </Tabs>

        {abaAtual === "empresa" && (
          <Form>
            <Linha>
              <label>ID</label>
              <input defaultValue="1"  disabled/>
            </Linha>
            <Linha>
              <label>Razão Social</label>
              <input value={razao} />
            </Linha>
            <Linha>
              <label>CNPJ</label>
              <input value={cnpj} />
            </Linha>
            <Linha>
              <label>IE</label>
              <input value={IE}/>
            </Linha>
            <Linha>
              <label>Bairro</label>
              <input value={bairro} />
            </Linha>
            <Linha>
              <label>Endereço</label>
              <input value={endereco} />
            </Linha>
            <Linha>
              <label>Cidade</label>
              <input value={cidade} />
            </Linha>
            <Linha>
              <label>Estado</label>
              <input value={estado} />
            </Linha>
          </Form>
        )}

        {abaAtual === "pdv" && (
          <Form>
            <Linha>
              <label>Saldo mínimo para resgate</label>
              <input value={sdmin} />
            </Linha>
            <Linha>
              <label>Percentual cashback</label>
              <input value={point} />
            </Linha>
            <Linha>
              <label>Desativar/Ativar venda manual</label>
              <SwitchContainer>
                <input
                  type="checkbox"
                  checked={vendaManual}
                  onChange={() => setVendaManual(!vendaManual)}
                />
                <span>{vendaManual ? "Ativo" : "Inativo"}</span>
              </SwitchContainer>
            </Linha>
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center" }}>
  <BotaoSalvar>Salvar</BotaoSalvar>
</div>

          </Form>
        )}

        {abaAtual === "impressora" && (
          
          <FormImpressao>
            <Linha>
              <label>ID</label>
              <input value={1} disabled/>
            </Linha>
            <Linha>
              <label>IP</label>
              <input value={ipPrincipal}disabled/>
            </Linha>
            <Linha>
              <label>Modelo</label>
              <input value={modeloImpressora} disabled/>
            </Linha>
            <LinhaImpressora>
              <HiOutlinePencilSquare
              style={{ cursor: "pointer" ,fontSize: "40px", color: "#73287d" }}
              onClick={() => setModalAberta(true)}
              />
  
            </LinhaImpressora>
          </FormImpressao>
        )}
      </Container>
      {modalAberta && <ModalEdicaoImpressora fechar={() => setModalAberta(false)} />}
    </>
  );
};

export default Parametros;
