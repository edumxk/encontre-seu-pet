import { Request, Response } from 'express';
import { CreatePetService } from '../services/CreatePetService';

export class CreatePetController {
    async handle(req: Request, res: Response) {
        const { 
            name, species, breed, color, size, 
            location, status, contact, reward,
            latitude, longitude
        } = req.body;
        
        const userId = req.userId;

        // Tratamento de múltiplos arquivos
        // O Multer coloca os arquivos em req.files (array)
        const requestImages = req.files as Express.Multer.File[];
        
        if (!requestImages || requestImages.length === 0) {
             return res.status(400).json({ error: "Pelo menos uma foto é obrigatória!" });
        }

        // Mapeia cada arquivo para uma URL completa
        const imageUrls = requestImages.map(file => {
            return `http://localhost:3000/uploads/${file.filename}`;
        });

        const createPetService = new CreatePetService();

        const pet = await createPetService.execute({
            name, species, breed, color, size,
            location, status, contact, reward,
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
            imageUrls,
            userId: Number(userId)
        });

        return res.status(201).json(pet);
    }
}