import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class NotificationController {
    async index(req: Request, res: Response) {
        const userId = req.userId;

        const notifications = await prisma.notification.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' }
        });

        return res.json(notifications);
    }

    async markAsRead(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.userId;

        await prisma.notification.updateMany({
            where: { 
                id: Number(id),
                userId: Number(userId) 
            },
            data: { read: true }
        });

        return res.status(204).send();
    }
}