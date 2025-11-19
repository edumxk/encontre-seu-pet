import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Definimos o que esse serviço precisa para trabalhar
interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export class CreateUserService {
    async execute({ name, email, password }: CreateUserRequest) {
        // 1. Regra: Verificar se existe
        const userAlreadyExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userAlreadyExists) {
            throw new Error("User already exists"); // Apenas lançamos o erro, quem trata é o controller
        }

        // 2. Regra: Criptografar senha
        const passwordHash = await bcrypt.hash(password, 8);

        // 3. Regra: Salvar no banco
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            } as any,
        });

        // removemos a senha do retorno
        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }
}