import { Request, Response } from 'express';
import { ShowProfileService } from '../services/ShowProfileService';
import { UpdateProfileService } from '../services/UpdateProfileService';

export class ProfileController {
    // Visualizar dados
    async show(req: Request, res: Response) {
        const userId = req.userId; // Vem do middleware
        const showProfile = new ShowProfileService();
        const user = await showProfile.execute(Number(userId));
        return res.json(user);
    }

    // Atualizar dados
    async update(req: Request, res: Response) {
        const userId = req.userId; // Vem do middleware
        const { name, phone, city, state } = req.body;

        const updateProfile = new UpdateProfileService();

        try {
            const user = await updateProfile.execute({
                user_id: Number(userId),
                name,
                phone,
                city,
                state
            });
            return res.json(user);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao atualizar perfil" });
        }
    }
}