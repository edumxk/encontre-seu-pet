import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService';

export class CreateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, password, confirmPassword } = req.body;

        // Validação básica de entrada (HTTP)
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const createUserService = new CreateUserService();

        try {
            // Chama o especialista (Service) para fazer o trabalho
            const user = await createUserService.execute({ name, email, password });

            return res.status(201).json(user);

        } catch (error) {
            // Trata erros conhecidos
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}