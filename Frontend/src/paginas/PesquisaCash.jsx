import styled, { createGlobalStyle } from "styled-components";
import logo from "../assets/img/logo.jpg";
import apiAcai from "../axios/config.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 70vw;
  justify-content: space-evenly;
  @media screen and (max-width: 900px) {
    height: 1px;
    width: 50vw;
    margin: auto;
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

const Button = styled.input`
  width: 100%;
  margin-top: 40px;
  padding: 12px 45px;
  background-color: #73287d;
  border: 1px solid #73287d;
  color: #f1f1f1;
  cursor: pointer;
  transition: 0.5s;

  &:hover {
    background-color: #8b43bb;
    border-radius: 50px;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: ${({ success }) => (success ? "green" : "red")};
`;
const variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const PesquisaCash = () => {
  const [cpf, setCpf] = useState("");
  const [message, setMessage] = useState(null);
  const [hasCashback, setHasCashback] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCpf(formatCPF(value));
  };

  const BotaoPesquisaCPF = async () => {
    try {
      const rawCpf = cpf.replace(/\D/g, "");

      if (!rawCpf || rawCpf.length !== 11) {
        throw new Error("CPF inválido.");
      }

      const encodedCPF = encodeURIComponent(rawCpf);
      const url = `/client/serach?cpf=${encodedCPF}`;
      const res = await apiAcai.get(url);
      const cliente = res.data.message[0];

      setIsExiting(true);
      setTimeout(() => {
        if (rawCpf === res.data.message[0].cpf) {
          setHasCashback(true);
          setMessage("Parabéns, existe cliente cadastrado com esse CPF");
          console.log("com cadastro");
          navigate("/pdv", {
            state: {
              id: cliente.id,
              cpf: cliente.cpf,
              nome: cliente.nome,
              pontos: cliente.cashback,
              origen: "comCadastro",
            },
          });
        } else {
          navigate("/pdv", {
            state: {
              origen: "semCadastro",
            },
          });
          setHasCashback(false);
          setMessage("Cliente não possui cadastro.");
          console.log("sem cadastro");
        }
      }, 500);
    } catch (error) {
      setHasCashback(false);
      console.log("sem cadastro");
      setMessage("Cliente não possui cadastro.");
      console.error("Erro ao encontrar cliente:", error.message);
    }
  };
  //BOTÃO CLIENTE SEM CPF
  const ClienteSemCPF = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/pdv", {
        state: {
          origen: "semCadastro",
        },
      });
      setHasCashback(false);
      setMessage("Cliente não possui cadastro.");
      console.log("sem cadastro");
    }, 500);
  };

  return (
    <>
      <GlobalStyle />
      <AnimatePresence mode="wait">
        {!isExiting && (
          <Container
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <LoginContainer>
              <LoginForm>
                <img src={logo} alt="Logo" />
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    BotaoPesquisaCPF(cpf);
                  }}
                >
                  <Label htmlFor="cpf">CPF:</Label>
                  <Input
                    mask="999.999.999-99"
                    type="text"
                    id="cpf"
                    name="cpf"
                    placeholder="Digite o CPF do cliente"
                    value={cpf}
                    onChange={handleChange}
                  />
                  
                  <Button type="submit" value="Pesquisar" />
                </Form>
                <Button type="button" value="Cliente Sem CPF" onClick={ClienteSemCPF} />

                {message && <Message success={hasCashback}>{message}</Message>}
              </LoginForm>
            </LoginContainer>
          </Container>
        )}
      </AnimatePresence>
    </>
  );
};

export default PesquisaCash;
