import { prisma } from '../lib/prisma';

export class ListUserPetsService {
    async execute(userId: number) {

        const myAds = await prisma.pet.findMany({
            where: { userId },
            include: { 
                images: true,
                finder: { select: { name: true, phone: true } } 
            },
            orderBy: { createdAt: 'desc' }
        });

        const petsIFound = await prisma.pet.findMany({
            where: { foundByUserId: userId },
            include: {
                images: true,
                user: { select: { name: true, phone: true } } 
            },
            orderBy: { resolvedAt: 'desc' }
        });

        return [...myAds, ...petsIFound];
    }
}