import { prisma } from '../config/prisma';

export class SessionRepository {
  async createSession(userId: string, token: string, userAgent?: string, ipAddress?: string) {
    return prisma.session.create({
      data: {
        userId,
        token,
        userAgent,
        ipAddress,
        isActive: true,
      },
    });
  }

  async deactivateSession(token: string) {
    return prisma.session.updateMany({
      where: { token, isActive: true },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });
  }

  async countActiveSessions() {
    return prisma.session.count({
      where: { isActive: true },
    });
  }

  async findActiveSessionsByUser(userId: string) {
    return prisma.session.findMany({
      where: { userId, isActive: true },
    });
  }
}
