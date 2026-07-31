import { UserRepository } from '../repositories/user.repository';
import { InterestRepository } from '../repositories/interest.repository';
import { UpdateProfileDto } from '../dtos/user.dto';

export class UserService {
  private userRepo = new UserRepository();
  private interestRepo = new InterestRepository();

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      isGuest: user.isGuest,
      role: user.role,
      interests: user.interests.map((ui) => ui.interest.name),
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.username || dto.avatar) {
      await this.userRepo.update(userId, {
        ...(dto.username && { username: dto.username }),
        ...(dto.avatar && { avatar: dto.avatar }),
      });
    }

    if (dto.interests) {
      await this.interestRepo.setUserInterests(userId, dto.interests);
    }

    return this.getProfile(userId);
  }
}
