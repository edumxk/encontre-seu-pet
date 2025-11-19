import { Request, Response } from 'express';
import { ListUserPetsService } from '../services/ListUserPetsService';
import { ResolvePetService } from '../services/ResolvePetService';

export class MyPetsController {

    async index(req: Request, res: Response) {
        const userId = req.userId;
        const service = new ListUserPetsService();
        const pets = await service.execute(Number(userId));
        return res.json(pets);
    }
    async resolve(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.userId;
        const { finalLatitude, finalLongitude, finderEmail, foundByExternal } = req.body;

        const service = new ResolvePetService();
        
        try {
            const pet = await service.execute({
                petId: Number(id),
                ownerId: Number(userId),
                finalLatitude: Number(finalLatitude),
                finalLongitude: Number(finalLongitude),
                finderEmail,
                foundByExternal
            });
            return res.json(pet);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "Erro ao resolver pet" });
        }
    }
}