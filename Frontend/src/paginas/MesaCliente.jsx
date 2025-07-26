import SideBar from "../componentes/SideBar";
import { experimentalStyled as styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiAcai from "../axios/config";
import { createGlobalStyle } from "styled-components";

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#73287d",
  ...theme.typography.body2,
  padding: "60px",
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const MesaCliente = () => {
  const [mesas, setMesas] = useState([]);

  const navigate = useNavigate(); // Hook para navegação

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

  const location = useLocation();
  const produtosPedido = location.state?.produtos || [];
  const uid = location.state.uid || 0;

  const handleMesaClick = (mesa) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `Deseja enviar o pedido para a mesa ${mesa.id}?`,
        text: `Mesa: ${mesa.Referencia}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, enviar!",
        cancelButtonText: "Não, cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const pedidoMesa = produtosPedido.map((produto) => ({
            uid: uid,
            prodno: produto.id,
            unino: produto.unino,
            valor_unit: produto.precoUnitario,
            valor_total: produto.unino * produto.precoUnitario,
            bit: 1,
            tableid: mesa.id,
          }));

          try {
            const res = await apiAcai.post("table/ped/insert", pedidoMesa);
            swalWithBootstrapButtons
              .fire(
                "Pedido Enviado!",
                `O pedido foi enviado para a mesa ${mesa.id}.`,
                "success"
              )
              .then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  navigate("/");
                }
              });
          } catch (error) {
            swalWithBootstrapButtons.fire(
              "Erro",
              "Houve um erro ao enviar o pedido. Tente novamente.",
              "error"
            );
            console.log("Erro ao enviar o pedido:", error);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "O pedido não foi enviado.",
            "error"
          );
        }
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <GlobalStyle />
      <SideBar />
      <Box
        component="main"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexGrow: 1,
          padding: 3,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          {mesas.map((mesa) => (
            <Grid item xs={4} sm={4} md={4} key={mesa.id}>
              <Item
                sx={{
                  color: "#fff",
                  backgroundColor:
                    mesa.t2 && mesa.t2.data && mesa.t2.data[0] === 0
                      ? "#73287d"
                      : "#d32f2f",
                  cursor: "pointer",
                }}
                onClick={() => handleMesaClick(mesa)}
              >
                <p>{`Numero da mesa: ${mesa.id}`}</p>
                <p>{`Nome da mesa: ${mesa.Referencia}`}</p>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MesaCliente;
