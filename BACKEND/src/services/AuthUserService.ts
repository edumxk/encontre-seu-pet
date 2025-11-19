import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthRequest {
    email: string;
    password: string;
}

export class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        // 1. Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new Error("Email ou senha incorretos");
        }

        // 2. Verificar se a senha bate (Hash vs Texto)
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Email ou senha incorretos");
        }

        // 3. Gerar o Token JWT
        // O primeiro argumento é o payload (o que vai dentro do token)
        // O segundo é a chave secreta
        // O terceiro é a configuração (expira em 30 dias)
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            {
                subject: user.id.toString(), // ID do usuário vira o "assunto" do token
                expiresIn: '30d'
            }
        );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        };
    }
}