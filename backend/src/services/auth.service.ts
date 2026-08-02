import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { InterestRepository } from '../repositories/interest.repository';
import { LogRepository } from '../repositories/log.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterDto, LoginDto, GuestAuthDto } from '../dtos/auth.dto';

export class AuthService {
  private userRepo = new UserRepository();
  private sessionRepo = new SessionRepository();
  private interestRepo = new InterestRepository();
  private logRepo = new LogRepository();

  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new Error('Este email já está cadastrado');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepo.createRegisteredUser({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    if (dto.interests && dto.interests.length > 0) {
      await this.interestRepo.setUserInterests(user.id, dto.interests);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role as 'USER' | 'ADMIN',
      isGuest: false,
    };

    const token = generateToken(payload);
    await this.sessionRepo.createSession(user.id, token, userAgent, ipAddress);

    await this.logRepo.createLog('INFO', `New user registered: ${user.email}`, { userId: user.id });

    return { user: payload, token };
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new Error('Credenciais inválidas');
    }

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciais inválidas');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role as 'USER' | 'ADMIN',
      isGuest: false,
    };

    const token = generateToken(payload);
    await this.sessionRepo.createSession(user.id, token, userAgent, ipAddress);

    await this.logRepo.createLog('INFO', `User logged in: ${user.email}`, { userId: user.id });

    return { user: payload, token };
  }

  async guestLogin(dto: GuestAuthDto, userAgent?: string, ipAddress?: string) {
    const guestUser = await this.userRepo.createGuestUser(dto.username);

    if (dto.interests && dto.interests.length > 0) {
      await this.interestRepo.setUserInterests(guestUser.id, dto.interests);
    }

    const payload = {
      userId: guestUser.id,
      email: null,
      username: guestUser.username,
      role: guestUser.role as 'USER' | 'ADMIN',
      isGuest: true,
    };

    const token = generateToken(payload);
    await this.sessionRepo.createSession(guestUser.id, token, userAgent, ipAddress);

    return { user: payload, token };
  }

  async logout(token: string) {
    await this.sessionRepo.deactivateSession(token);
  }
}
