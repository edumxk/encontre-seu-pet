import { prisma } from '../lib/prisma';

export class ShowProfileService {
    async execute(user_id: number) {
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        // Remover senha do retorno
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}