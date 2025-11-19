import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    sub: string; // 'sub' é o padrão onde o JWT guarda o ID do usuário
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const [, token] = authorization.split(" ");

    try {
        // Decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        
        // Força a tipagem para ler o 'sub' (subject/assunto)
        const { sub } = decoded as TokenPayload;

        // Converte string para numero e salva na requisição
        req.userId = Number(sub); 

        return next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}