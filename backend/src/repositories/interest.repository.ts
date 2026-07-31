import { prisma } from '../config/prisma';

export class InterestRepository {
  async findAll() {
    return prisma.interest.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByName(name: string) {
    return prisma.interest.findUnique({
      where: { name: name.toLowerCase() },
    });
  }

  async create(name: string) {
    return prisma.interest.create({
      data: { name: name.toLowerCase() },
    });
  }

  async setUserInterests(userId: string, interestNames: string[]) {
    // 1. Ensure all interests exist
    const interestRecords = await Promise.all(
      interestNames.map(async (name) => {
        const cleanName = name.trim().toLowerCase();
        let found = await this.findByName(cleanName);
        if (!found) {
          found = await this.create(cleanName);
        }
        return found;
      })
    );

    // 2. Delete existing user interests
    await prisma.userInterest.deleteMany({
      where: { userId },
    });

    // 3. Create new join records
    if (interestRecords.length > 0) {
      await prisma.userInterest.createMany({
        data: interestRecords.map((item) => ({
          userId,
          interestId: item.id,
        })),
      });
    }
  }
}
