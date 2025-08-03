import { Router, Request, Response } from 'express';
import cxService from "../service/cx.service";

const cx = Router();

cx.get("/validate", async (req: Request, res: Response): Promise<void> => {
    let { user_cx } = req.query;

    if (Array.isArray(user_cx)) {
        user_cx = user_cx[0];
    }

    if (typeof user_cx !== "string") {
        res.status(400).json({ success: false, error: "Parâmetro user_cx inválido" });
        return;
    }

    const userCxNumber = Number(user_cx);
    if (isNaN(userCxNumber)) {
        res.status(400).json({ success: false, error: "Parâmetro user_cx deve ser numérico" });
        return;
    }

    const result = await cxService.getCx(userCxNumber);

    res.status(result.success ? 200 : 500).json(result);
});

cx.post("/open", async (req: Request, res: Response) => {
    const { user_cx, dinheiro } = req.body;
    const result = await cxService.openCx(user_cx, dinheiro);

    if (result.code === 409) {
        res.status(409).json(result);
    }

    res.status(result.success ? 200 : 500).json(result);
})

cx.post("/forceopen", async (req: Request, res: Response) => {
    const { user_cx, dinheiro } = req.body;
    const result = await cxService.forceOpenCx(user_cx, dinheiro);

    if (result.code == 404) {
        res.status(404).json(result);
    }

    res.status(result.success ? 200 : 500).json(result);
})

cx.post("/close", async (req: Request, res: Response) => {
    const { user_cx, credito, debito, pix, dinheiro, fcx, vsang, trnc, abertura } = req.body;
    const result = await cxService.closeCx(user_cx, credito, debito, pix, dinheiro, fcx, vsang, trnc, abertura);

    res.status(result.success ? 200 : 500).json(result);
})

cx.post("/sangria", async (req: Request, res: Response) => {
    const { user_cx, sang, sd_old } = req.body;
    const result = await cxService.withdrawing(user_cx, sang, sd_old);

    if (result.code == "SALDO_INSUFICIENTE") {
        res.status(422).json(result);
    } else if (result.code == "ADMIN_SANGRIA") {
        res.status(403).json(result);
    }

    res.status(result.success ? 200 : 500).json(result)
})

export default cx;