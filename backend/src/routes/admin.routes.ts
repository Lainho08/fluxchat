import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { MatchmakingService } from '../services/matchmaking.service';

export function createAdminRouter(matchmakingService: MatchmakingService) {
  const router = Router();
  const controller = new AdminController(matchmakingService);

  router.use(authenticateToken, requireAdmin);
  router.get('/dashboard', controller.getDashboard);

  return router;
}
