import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId: number; // Aqui ensinamos que existe um userId numérico
    }
  }
}