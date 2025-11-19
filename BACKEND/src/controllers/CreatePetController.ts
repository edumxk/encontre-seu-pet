import { Request, Response } from 'express';
import { CreatePetService } from '../services/CreatePetService';
import { supabase } from '../lib/supabase'; // Importe o cliente
import crypto from 'crypto';

export class CreatePetController {
    async handle(req: Request, res: Response) {
        const { 
            name, species, breed, color, size, 
            location, status, contact, reward,
            latitude, longitude ,
        } = req.body;
        
        const userId = req.userId; 

        // Tratamento de múltiplos arquivos (AGORA NA MEMÓRIA)
        const requestImages = req.files as Express.Multer.File[];
        
        if (!requestImages || requestImages.length === 0) {
             return res.status(400).json({ error: "Pelo menos uma foto é obrigatória!" });
        }

        const imageUrls: string[] = [];

        // UPLOAD PARA O SUPABASE
        for (const file of requestImages) {
            // Gera nome único
            const fileHash = crypto.randomBytes(16).toString('hex');
            // Sanitiza nome (sem espaços)
            const fileName = `${fileHash}-${file.originalname.replace(/\s+/g, '-')}`;

            const { data, error } = await supabase
                .storage
                .from('pets') // Nome do bucket que criamos
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) {
                console.error("Erro no upload Supabase:", error);
                return res.status(500).json({ error: "Erro ao salvar imagem na nuvem." });
            }

            // Gera a URL pública
            const { data: publicUrlData } = supabase
                .storage
                .from('pets')
                .getPublicUrl(fileName);

            imageUrls.push(publicUrlData.publicUrl);
        }

        const createPetService = new CreatePetService();

        const pet = await createPetService.execute({
            name, species, breed, color, size,
            location, status, contact, reward,
            imageUrls,
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
            userId: Number(userId)
        });

        return res.status(201).json(pet);
    }
}