import { prisma } from '../lib/prisma';

interface UpdateRequest {
    user_id: number;
    name: string;
    phone: string;
    city: string;
    state: string;
}

export class UpdateProfileService {
    async execute({ user_id, name, phone, city, state }: UpdateRequest) {
        // Verifica se usuário existe
        const userExists = await prisma.user.findUnique({ where: { id: user_id } });

        if (!userExists) {
            throw new Error("Usuário não encontrado");
        }

        // Atualiza os dados
        const userUpdated = await prisma.user.update({
            where: { id: user_id },
            data: {
                name,
                phone,
                city,
                state
            }
        });

        const { password, ...userWithoutPassword } = userUpdated;
        return userWithoutPassword;
    }
}