import { prisma } from '../lib/prisma';

export class ListPetsService {
    async execute() {
        const pets = await prisma.pet.findMany({
            where: {
                status: {
                    not: 'finalizado'
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, phone: true } },
                images: true
            }
        });
        return pets;
    }
}