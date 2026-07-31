import { InterestRepository } from '../repositories/interest.repository';

export class InterestService {
  private interestRepo = new InterestRepository();

  async getAllInterests() {
    const interests = await this.interestRepo.findAll();
    return interests.map((i) => i.name);
  }

  async addInterest(name: string) {
    const clean = name.trim().toLowerCase();
    const existing = await this.interestRepo.findByName(clean);
    if (existing) return existing;
    return this.interestRepo.create(clean);
  }
}
