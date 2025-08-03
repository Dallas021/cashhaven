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

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
`;
const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #73287d;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;
const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 26px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
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
  const [vendaManual, setVendaManual] = useState("0.00");
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
  const [sdmin, setSdmin] = useState("0.00");
  const [point, setPoint] = useState("0.00");

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
            const res = await apiAcai.get("param/all");
    
            setSdmin(formatarParaDecimal(res.data.message[5].valor.toString()));
            setPoint(formatarParaDecimal(res.data.message[2].valor.toString()));
            setVendaManual(res.data.message[9].valor);
          } catch (error) {
            console.log("Erro", error);
          }
        };
        carregarParametros();
      }, []);

      const atualizarParametros = async (e) => {
        e.preventDefault();
        try {
        
          const payload = [
            { id: 6, valor: sdmin, bit: 1},
            { id: 3, valor: point,bit: 1 },
            { id: 10, valor: vendaManual, bit: 1},
          ];
      
          const res = await apiAcai.put("/param/update", payload)
      
          if (res.status === 200) { 
            //window.location.reload();
          }
        } catch (error) {
          console.error("Erro ao atualizar parâmetros:", error);
        }
      };
      function formatarParaDecimal(valor) {
        const numeros = valor.replace(/\D/g, "");
      
        if (!numeros) return "0.00";
      
        if (numeros.length === 1) return "0.0" + numeros;
        if (numeros.length === 2) return "0." + numeros;
      
        const parteInteira = numeros.slice(0, -2);
        const parteDecimal = numeros.slice(-2);
      
        return parteInteira + "." + parteDecimal;
      }
      function desformatarDecimal(valor) {
        return parseFloat(valor);
      }
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
      <input
        value={sdmin}
        onChange={(e) => setSdmin(formatarParaDecimal(e.target.value))}
      />
    </Linha>
    <Linha>
            <label>Percentual cashback</label>
      <input
      value={point}
       onChange={(e) => setPoint(formatarParaDecimal(e.target.value))}
      />
       </Linha>
            <Linha>
              <label>Desativar/Ativar venda manual</label>
              <SwitchContainer>
                <SwitchLabel>
                  <SwitchInput
                    type="checkbox"
                    checked={vendaManual === "1.00"}
                    onChange={(e) => setVendaManual(e.target.checked ? "1.00" : "0.00")}
                  />
                  <SwitchSlider />
                </SwitchLabel>
                <span>{vendaManual === "1.00" ? "Ativo" : "Inativo"}</span>
              </SwitchContainer>
            </Linha>
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center" }}>
                  <BotaoSalvar onClick={atualizarParametros}> Salvar</BotaoSalvar>
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
