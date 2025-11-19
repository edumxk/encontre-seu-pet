import { prisma } from '../lib/prisma';

interface ResolveRequest {
    petId: number;
    ownerId: number;
    finalLatitude: number;
    finalLongitude: number;
    finderEmail?: string;    
    foundByExternal?: string | null; 
}

export class ResolvePetService {
    async execute({ petId, ownerId, finalLatitude, finalLongitude, finderEmail, foundByExternal }: ResolveRequest) {
        
        const pet = await prisma.pet.findUnique({ where: { id: petId } });
        if (!pet || pet.userId !== ownerId) {
            throw new Error("Pet não encontrado ou sem permissão.");
        }

        let foundByUserId: number | null = null;
        let finalFoundByExternal = foundByExternal;

        if (finderEmail) {
            const userFinder = await prisma.user.findUnique({
                where: { email: finderEmail }
            });

            if (!userFinder) {
                throw new Error(`Usuário com o email '${finderEmail}' não encontrado no sistema.`);
            }

            
            foundByUserId = userFinder.id;
            finalFoundByExternal = null; 
        }

        const updatedPet = await prisma.pet.update({
            where: { id: petId },
            data: {
                status: 'finalizado',
                resolvedAt: new Date(),
                finalLatitude,
                finalLongitude,
                foundByUserId,
                foundByExternal: finalFoundByExternal
            }
        });

        return updatedPet;
    }
}