import { Request, Response } from 'express';
import { CreateSightingService } from '../services/CreateSightingService';

export class CreateSightingController {
    async handle(req: Request, res: Response) {
        const { id } = req.params; // ID do Pet
        const { latitude, longitude, dateTime, description } = req.body;
        const userId = req.userId;

        const service = new CreateSightingService();

        const sighting = await service.execute({
            petId: Number(id),
            userId: Number(userId),
            latitude, longitude, dateTime, description
        });

        return res.json(sighting);
    }
}