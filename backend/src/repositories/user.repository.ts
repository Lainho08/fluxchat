import { prisma } from '../config/prisma';
import { Role, User } from '@prisma/client';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        interests: {
          include: { interest: true },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        interests: {
          include: { interest: true },
        },
      },
    });
  }

  async createRegisteredUser(data: {
    email: string;
    username: string;
    passwordHash: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        isGuest: false,
        role: data.role || Role.USER,
      },
    });
  }

  async createGuestUser(username?: string) {
    return prisma.user.create({
      data: {
        username: username || `Guest_${Math.floor(1000 + Math.random() * 9000)}`,
        isGuest: true,
      },
    });
  }

  async update(id: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async countTotalUsers() {
    return prisma.user.count();
  }

  async findRecentUsers(limit = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        isGuest: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
