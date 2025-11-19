import { prisma } from '../lib/prisma';

interface CreatePetRequest {
    // ... outros campos (name, species, etc) iguais ...
    name?: string;
    species: string;
    breed?: string;
    color?: string;
    size?: string;
    location: string;
    status: string;
    contact?: string;
    reward?: string;
    latitude?: number; 
    longitude?: number;
    
    imageUrls: string[]; // <--- MUDOU: Agora recebemos um array de strings
    
    userId: number;
}

export class CreatePetService {
    async execute(data: CreatePetRequest) {
        const pet = await prisma.pet.create({
            data: {
                name: data.name,
                species: data.species,
                breed: data.breed,
                color: data.color,
                size: data.size,
                location: data.location,
                status: data.status,
                contact: data.contact,
                reward: data.reward,
                userId: data.userId,
                latitude: data.latitude,   // <--- Salva no banco
                longitude: data.longitude, // <--- Salva no banco
                
                // MÁGICA DO PRISMA: Cria as imagens relacionadas automaticamente
                images: {
                    create: data.imageUrls.map(url => ({ url }))
                }
            },
            include: {
                images: true // Retorna as imagens criadas na resposta
            }
        });

        return pet;
    }
}