import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import interestRoutes from './interest.routes';
import { createAdminRouter } from './admin.routes';
import { MatchmakingService } from '../services/matchmaking.service';

export function createApiRouter(matchmakingService: MatchmakingService) {
  const router = Router();

  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/interests', interestRoutes);
  router.use('/admin', createAdminRouter(matchmakingService));

  return router;
}
