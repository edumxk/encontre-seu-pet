import { Request, Response } from 'express';
import { ListPetsService } from '../services/ListPetsService';

export class ListPetsController {
    async handle(req: Request, res: Response) {
        const listPetsService = new ListPetsService();

        const pets = await listPetsService.execute();

        // Mapeamento opcional: Se o frontend espera "nome" mas o banco é "name", 
        // podemos ajustar aqui ou no frontend. Vamos retornar direto do banco por enquanto.
        return res.json(pets);
    }
}