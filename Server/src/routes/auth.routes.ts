import { Router, Request, Response, NextFunction } from 'express';
import authService from '../service/auth.service';

const auth = Router();

auth.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { usuario, senha } = req.body;

    const result = await authService.loginUser(usuario, senha);

    if (result.code === 404) {
        res.status(404).json(result)
    }

    res.status(result.success ? 200 : 500).json(result)
});

auth.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const result = await authService.registerUser(userData);

    res.status(result.success ? 201 : 500).json(result)
});

export default auth;