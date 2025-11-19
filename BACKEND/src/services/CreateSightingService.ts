import { prisma } from '../lib/prisma';

interface SightingRequest {
    petId: number;
    userId: number; 
    latitude: number;
    longitude: number;
    dateTime: string;
    description: string;
}

export class CreateSightingService {
    async execute({ petId, userId, latitude, longitude, dateTime, description }: SightingRequest) {
        const sightingDate = new Date(dateTime);
        const now = new Date();

        if (sightingDate > now) {
            throw new Error("A data do avistamento não pode ser no futuro.");
        }

        const pet = await prisma.pet.findUnique({
            where: { id: petId },
            include: { user: true } 
        });

        if (!pet) throw new Error("Pet não encontrado");

        const sighting = await prisma.sighting.create({
            data: {
                petId,
                userId,
                latitude,
                longitude,
                dateTime: sightingDate,
                description
            }
        });

        if (pet.userId !== userId) {
            await prisma.notification.create({
                data: {
                    userId: pet.userId, 
                    title: `Nova pista sobre ${pet.name}!`,
                    message: `Alguém disse que viu seu pet perto de você. Clique para ver no mapa.`,
                    type: 'sighting',
                    link: `/pet/${pet.id}`
                }
            });
        }

        return sighting;
    }
}