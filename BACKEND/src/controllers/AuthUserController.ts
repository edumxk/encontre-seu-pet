import { Request, Response } from 'express';
import { AuthUserService } from '../services/AuthUserService';

export class AuthUserController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;

        const authUserService = new AuthUserService();

        try {
            const auth = await authUserService.execute({
                email,
                password
            });

            return res.json(auth);

        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno" });
        }
    }
}