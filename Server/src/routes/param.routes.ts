import { Router, Request, Response } from "express";
import paramService from '../service/param.service';

const param = Router();

param.get("/all", async (req: Request, res: Response) => {
    const result = await paramService.allParams()

    res.status(result.success ? 200 : 500).json(result);
})

param.put("/update", async (req: Request, res: Response) => {
    const {valor, bit, id} = req.body;

    const result = await paramService.updateParams(valor, bit, id);

    res.status(result.success ? 200 : 500).json(result);
})

export default param;
