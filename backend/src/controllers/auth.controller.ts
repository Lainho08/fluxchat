import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await this.authService.register(req.body, userAgent, ipAddress);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await this.authService.login(req.body, userAgent, ipAddress);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  guestLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await this.authService.guestLogin(req.body, userAgent, ipAddress);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (token) {
        await this.authService.logout(token);
      }
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  };
}
