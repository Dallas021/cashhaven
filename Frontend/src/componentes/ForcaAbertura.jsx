import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const ForcaAbertura = async (acaoConfirmada, mensagemErro) => {
  const resultado = await MySwal.fire({
    title: "Abertura/Fechamento Caixa",
    text: mensagemErro || "Deseja forçar a abertura mesmo assim?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, continuar!",
    cancelButtonText: "Cancelar"
  });

  if (resultado.isConfirmed) {
    await acaoConfirmada();

    await MySwal.fire({
      title: "Caixa aberto com sucesso!",
      icon: "success"
    });
  }
};
