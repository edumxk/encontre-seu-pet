import { prisma } from '../lib/prisma';

export class GetPetDetailsService {
    async execute(petId: number) {
        const pet = await prisma.pet.findUnique({
            where: { id: petId },
            include: {
                images: true,
                user: { 
                    select: { 
                        id: true, 
                        name: true, 
                        phone: true, 
                        email: true 
                    }
                },
                sightings: { 
                    include: {
                        user: { 
                            select: { 
                                id: true,
                                name: true, 
                                email: true, 
                                phone: true  
                            } 
                        } 
                    },
                    orderBy: { dateTime: 'desc' }
                }
            }
        });

        if (!pet) {
            throw new Error("Pet não encontrado");
        }

        return pet;
    }
}