import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { SessionController } from '../controllers/session.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UpdateProfileDtoSchema } from '../dtos/user.dto';

const router = Router();
const userController = new UserController();
const sessionController = new SessionController();

router.use(authenticateToken);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(UpdateProfileDtoSchema), userController.updateProfile);
router.get('/sessions', sessionController.getActiveSessions);

export default router;
