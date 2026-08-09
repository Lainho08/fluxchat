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

    logger.info(
      `Matchmaking request: Socket ${candidate.socketId} (${candidate.username}) ` +
      `mode=${candidate.mode} gender=${candidate.gender || 'UNSPECIFIED'} ` +
      `pref=${candidate.genderPreference || 'BOTH'} ` +
      `country=${candidate.countryCode || '??'} countryPref=${candidate.countryPreference || 'ANY'} ` +
      `interests=[${candidate.interests.join(', ')}]`
    );

    // --- Phase 1: Try to match with preferred country ---
    const phaseOneMatch = this.findMatch(candidate, /* requireCountry */ true);
    if (phaseOneMatch) return phaseOneMatch;

    // --- Phase 2: Fallback — match with any country ---
    const phaseTwoMatch = this.findMatch(candidate, /* requireCountry */ false);
    if (phaseTwoMatch) return phaseTwoMatch;

    // No match found yet — add to waiting pool
    this.waitingCandidates.set(candidate.socketId, candidate);
    await redis.sadd(`queue:${candidate.mode}`, candidate.socketId);

    return null;
  }

  /**
   * Searches the waiting pool for a compatible candidate.
   * @param requireCountry If true, also checks country preference compatibility.
   */
  private findMatch(candidate: MatchmakingCandidate, requireCountry: boolean): MatchmakingCandidate | null {
    for (const [otherSocketId, other] of this.waitingCandidates.entries()) {
      if (otherSocketId === candidate.socketId) continue;
      if (other.mode !== candidate.mode) continue;

      // Check bidirectional gender preference compatibility
      const candidatePrefersOther =
        !candidate.genderPreference ||
        candidate.genderPreference === 'BOTH' ||
        candidate.genderPreference === (other.gender || 'UNSPECIFIED');

      const otherPrefersCandidate =
        !other.genderPreference ||
        other.genderPreference === 'BOTH' ||
        other.genderPreference === (candidate.gender || 'UNSPECIFIED');

      if (!candidatePrefersOther || !otherPrefersCandidate) continue;

      // Check interest intersection
      const hasCommonInterest = candidate.interests.some((i) => other.interests.includes(i));
      const canMatch =
        candidate.interests.length === 0 ||
        other.interests.length === 0 ||
        hasCommonInterest;

      if (!canMatch) continue;

      // Check country preference (only in phase 1)
      if (requireCountry) {
        const myCandidateWantsCountry = candidate.countryPreference && candidate.countryPreference !== 'ANY';
        const otherWantsCountry = other.countryPreference && other.countryPreference !== 'ANY';

        // If I have a country preference, the other must be from that country
        if (myCandidateWantsCountry && other.countryCode !== candidate.countryPreference) continue;

        // If the other has a country preference, I must be from that country
        if (otherWantsCountry && candidate.countryCode !== other.countryPreference) continue;
      }

      // ✅ Found a match!
      this.waitingCandidates.delete(otherSocketId);
      return other;
    }

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
