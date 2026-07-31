import { Request, Response, NextFunction } from 'express';
import { InterestService } from '../services/interest.service';

export class InterestController {
  private interestService = new InterestService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const interests = await this.interestService.getAllInterests();
      res.json({ interests });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const interest = await this.interestService.addInterest(name);
      res.status(201).json(interest);
    } catch (error) {
      next(error);
    }
  };
}
