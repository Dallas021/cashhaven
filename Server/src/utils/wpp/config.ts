import axios from "axios";

export async function sendWhatsappMessage(tel: string, message: string) {
    try {
        const url = `${process.env.routeWhatsapp}send-text?instanceId=${process.env.instancia_id}`;

        const response = await axios.post(
            url,
            {
                phone: tel,
                message: message
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.instancia_token}`,
                }
            }
        );

        return response.data;

    } catch (error: any) {
        console.error("Erro ao enviar mensagem WhatsApp:", error.response?.data || error.message);
        throw error;
    }
}

export default {
    sendWhatsappMessage
}