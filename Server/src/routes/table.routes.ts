import { Router, Request, Response } from "express";
import tableService from "../service/table.service";

const table = Router()

table.get("/all", async (req:Request, res:Response) => {
    const result = await tableService.allTables();

    res.status(result.success ? 200 : 500).json(result);
})

table.post("/create", async (req:Request, res:Response) => {
    const {id, referencia} = req.body;

    const result = await tableService.insertTable(id, referencia);

    res.status(result.success ? 200 : 500).json(result)
    
})

table.delete("/dell/:id", async (req:Request, res:Response) => {
    const { id } = req.params;
    const uid = Number(id)

    const result = await tableService.deletTable(uid);

    res.status(result.success ? 200 : 500).json(result)
})

table.post("/ped/insert", async (req: Request, res: Response) => {
    const pedidos = req.body;

    const result = await tableService.insertTablePed(pedidos);

    res.status(result.success ? 201 : 500).json(result)
});


table.get("/ped/all", async (req:Request, res:Response) => {
    const result = await tableService.pedTable();

    res.status(result.success ? 200 : 500).json(result)
})

table.post("/liberar/all", async (req:Request, res:Response) => {
    const result = await tableService.cleanTablePed();

    res.status(result.success ? 200 : 500).json(result)
})

export default table;