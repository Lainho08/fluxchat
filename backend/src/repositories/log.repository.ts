import { prisma } from '../config/prisma';
import { ChatMode, LogLevel } from '@prisma/client';

export class LogRepository {
  async createLog(level: LogLevel, message: string, metadata?: any) {
    return prisma.log.create({
      data: {
        level,
        message,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  }

  async findRecentLogs(limit = 50) {
    return prisma.log.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createConnectionRecord(user1Id: string, user2Id: string, mode: ChatMode, roomId?: string) {
    return prisma.connectionHistory.create({
      data: {
        user1Id,
        user2Id,
        mode,
        roomId,
      },
    });
  }

  async endConnectionRecord(roomId: string) {
    const record = await prisma.connectionHistory.findFirst({
      where: { roomId, endedAt: null },
    });

    if (record) {
      const endedAt = new Date();
      const durationSeconds = Math.floor((endedAt.getTime() - record.startedAt.getTime()) / 1000);

      await prisma.connectionHistory.update({
        where: { id: record.id },
        data: {
          endedAt,
          durationSeconds,
        },
      });
    }
  }

  async countTotalConnections() {
    return prisma.connectionHistory.count();
  }
}
