import { Router, Request, Response, NextFunction } from 'express';
import impService from '../service/imp.service';

const imp = Router();

imp.post("/register", async (req:Request, res:Response) => {
    const {ip, model} = req.body;

    const result = await impService.registerImp(ip, model);

    res.status(result.success ? 200 : 500).json(result);
})

imp.get("/all", async (req:Request, res:Response) => {
    const result = await impService.allImp();

    res.status(result.success ? 200 : 500).json(result);
})

imp.get("/all/models", async (req:Request, res:Response) => {
    const result = await impService.allModels();

    res.status(result.success ? 200 : 500).json(result);
})

imp.get("/primary", async (req: Request, res: Response) => {
    const result = await impService.primaryImp();

    res.status(result.success ? 200 : 500).json(result)
})

imp.put("/primary/salved", async (req: Request, res:Response) => {
    const { id } = req.body;

    const result = await impService.salvaPrimaryImp(id)

    res.status(result.success ? 200 : 500).json(result);
})

export default imp;