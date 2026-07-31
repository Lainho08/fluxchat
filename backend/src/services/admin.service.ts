import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { LogRepository } from '../repositories/log.repository';

export class AdminService {
  private userRepo = new UserRepository();
  private sessionRepo = new SessionRepository();
  private logRepo = new LogRepository();

  async getDashboardMetrics(activeSocketsCount: number, activeRoomsCount: number) {
    const totalUsers = await this.userRepo.countTotalUsers();
    const activeSessions = await this.sessionRepo.countActiveSessions();
    const totalConnections = await this.logRepo.countTotalConnections();
    const recentLogs = await this.logRepo.findRecentLogs(20);
    const recentUsers = await this.userRepo.findRecentUsers(10);

    return {
      metrics: {
        onlineUsers: activeSocketsCount,
        activeRooms: activeRoomsCount,
        activeSessions,
        totalUsers,
        totalConnections,
      },
      recentLogs,
      recentUsers,
    };
  }
}
