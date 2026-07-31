import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { MatchmakingService } from '../services/matchmaking.service';
import { AuthenticatedRequest } from '../types';

export class AdminController {
  private adminService = new AdminService();
  private matchmakingService: MatchmakingService;

  constructor(matchmakingService: MatchmakingService) {
    this.matchmakingService = matchmakingService;
  }

  getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const io = req.app.get('io');
      const activeSocketsCount = io ? io.engine.clientsCount : 0;
      const activeRoomsCount = this.matchmakingService.getActiveRoomsCount();

      const metrics = await this.adminService.getDashboardMetrics(activeSocketsCount, activeRoomsCount);
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  };
}
