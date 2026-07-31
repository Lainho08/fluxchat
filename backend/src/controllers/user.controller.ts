import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../types';

export class UserController {
  private userService = new UserService();

  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const profile = await this.userService.getProfile(userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const updated = await this.userService.updateProfile(userId, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
}
