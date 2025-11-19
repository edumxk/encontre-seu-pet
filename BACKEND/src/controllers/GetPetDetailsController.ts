import { Request, Response } from 'express';
import { GetPetDetailsService } from '../services/GetPetDetailsService';

export class GetPetDetailsController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const service = new GetPetDetailsService();

        try {
            const pet = await service.execute(Number(id));
            return res.json(pet);
        } catch (error) {
            return res.status(404).json({ error: "Pet não encontrado" });
        }
    }
}