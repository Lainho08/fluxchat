import { redis } from '../config/redis';
import { MatchmakingCandidate, ChatMode } from '../types';
import { LogRepository } from '../repositories/log.repository';
import { logger } from '../utils/logger';

export class MatchmakingService {
  private logRepo = new LogRepository();

  // In-memory active queue state & rooms tracking
  private waitingCandidates: Map<string, MatchmakingCandidate> = new Map();
  private activeRooms: Map<string, { user1: MatchmakingCandidate; user2: MatchmakingCandidate; mode: ChatMode; createdAt: Date }> = new Map();

  async addToQueue(candidate: MatchmakingCandidate): Promise<MatchmakingCandidate | null> {
    this.removeFromQueue(candidate.socketId);

    logger.info(`Matchmaking request: Socket ${candidate.socketId} (${candidate.username}) mode=${candidate.mode} interests=[${candidate.interests.join(', ')}]`);

    // Search for match in waiting pool
    for (const [otherSocketId, other] of this.waitingCandidates.entries()) {
      if (otherSocketId === candidate.socketId) continue;
      if (other.mode !== candidate.mode) continue;

      // Check interest intersection
      const hasCommonInterest = candidate.interests.some((interest) =>
        other.interests.includes(interest)
      );

      // If either user has no interests or there's a common interest, match them!
      const canMatch =
        candidate.interests.length === 0 ||
        other.interests.length === 0 ||
        hasCommonInterest;

      if (canMatch) {
        this.waitingCandidates.delete(otherSocketId);
        return other;
      }
    }

    // No match found yet, store in waiting candidates
    this.waitingCandidates.set(candidate.socketId, candidate);

    // Also register in Redis for analytics / distributed queue awareness
    await redis.sadd(`queue:${candidate.mode}`, candidate.socketId);

    return null;
  }

  removeFromQueue(socketId: string) {
    const candidate = this.waitingCandidates.get(socketId);
    if (candidate) {
      this.waitingCandidates.delete(socketId);
      redis.srem(`queue:${candidate.mode}`, socketId).catch(() => {});
    }
  }

  registerRoom(roomId: string, candidate1: MatchmakingCandidate, candidate2: MatchmakingCandidate, mode: ChatMode) {
    this.activeRooms.set(roomId, {
      user1: candidate1,
      user2: candidate2,
      mode,
      createdAt: new Date(),
    });

    // Record in DB async
    this.logRepo.createConnectionRecord(
      candidate1.userId,
      candidate2.userId,
      mode === 'VIDEO' ? 'VIDEO' : mode === 'AUDIO' ? 'AUDIO' : 'TEXT',
      roomId
    ).catch((err) => logger.error(`Failed to record connection history: ${err.message}`));
  }

  closeRoom(roomId: string) {
    const room = this.activeRooms.get(roomId);
    if (room) {
      this.activeRooms.delete(roomId);
      this.logRepo.endConnectionRecord(roomId).catch((err) => logger.error(`Failed to close connection history record: ${err.message}`));
    }
  }

  getActiveRoomsCount(): number {
    return this.activeRooms.size;
  }

  getWaitingCount(): number {
    return this.waitingCandidates.size;
  }
}
