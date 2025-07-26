import styled, { createGlobalStyle } from "styled-components";
import usuario from "../assets/img/user.png";
import { useState } from "react";
// import { toast } from "react-toastify";
// import apiAcai from "../axios/config.js";
import Switch from "react-switch";
import { useLocation, useNavigate } from "react-router-dom";
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

export const CadastroCash = () => {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [point, setPoint] = useState("");
  const [recebido, setRecebido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [vpoint, setVpoint] = useState("");
  const [bp, setBp] = useState(0);
  const navigate = useNavigate();

  const local = useLocation();
  const origem = local.state?.origen;
  const cpfLocal = local.state?.arrayState.cpf;
  const nomeLocal = local.state?.arrayState.nome;
  const verificarBp = () => {
    const inativo = parseFloat(bp) === 1;

    return inativo;
  };
  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    setBp(checked ? 1 : 0);
  };
  const formatCashback = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
    return formattedValue.replace(".", ".");
  };
  const varificarVpoint = (e) => {
    const value = e.target.value;
    setVpoint(formatCashback(value));
  };
  const varificarVrecebido = (e) => {
    const value = e.target.value;
    setRecebido(formatCashback(value));
  };

  const enviarPedido = (e) => {
    e.preventDefault();

    navigate("/pdv", { state: { origen: "cash" } });
  };

  // const enviarPedido = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const dadosPedido = {
  //       cpf,
  //       recebido,
  //       vpoint,
  //       bp,
  //     };
  //     setEnviando(true);
  //     const res = await apiAcai.post("/order/create", dadosPedido);
  //     if (res.status === 200) {
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.error[0]);
  //   } finally {
  //     setEnviando(false);
  //   }
  // };
  return (
    <>
      <GlobalStyle />
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
                value={cpfLocal}
                onChange={(e) => setCpf(e.target.value)}
                disabled
              />
            </Form>
            <Form>
              <Label>Nome</Label>
              <Input
                type="text"
                value={nomeLocal}
                onChange={(e) => setName(e.target.value)}
                disabled
              />
            </Form>
            <Form>
              <Label>Pontos</Label>
              <Input
                type="text"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                disabled
              />
            </Form>
          </LoginForm>
        </LoginContainer>
        <LoginContainer>
          <LoginForm>
            <form onSubmit={(e) => enviarPedido(e)}>
              <Form>
                <p>Dados do pedido:</p>
                <Label>Valor do pedido</Label>
                <Input
                  type="text"
                  name="pedido"
                  placeholder="Valor do pedido do cliente"
                  value={recebido}
                  onChange={varificarVrecebido}
                />
              </Form>
              <Form>
                <Label>Cashback utlizado</Label>
                <Input
                  type="text"
                  name="pedido"
                  placeholder="Valor utilizado pelo cliente"
                  value={vpoint}
                  onChange={varificarVpoint}
                  disabled={!verificarBp()}
                />
              </Form>
              <Label>Cliente utiliza cashback? </Label>
              <Switch
                onChange={handleSwitchChange}
                checked={isChecked}
                onColor="#46295a"
                onHandleColor="#593471"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
              />

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
          </LoginForm>
        </LoginContainer>
      </Container>
    </>
  );
};
