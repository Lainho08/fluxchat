import { Response, NextFunction } from 'express';
import { SessionRepository } from '../repositories/session.repository';
import { AuthenticatedRequest } from '../types';

export class SessionController {
  private sessionRepo = new SessionRepository();

  getActiveSessions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const sessions = await this.sessionRepo.findActiveSessionsByUser(userId);
      res.json({ sessions });
    } catch (error) {
      next(error);
    }
  };
}
