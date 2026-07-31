import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';
import { RegisterDtoSchema, LoginDtoSchema, GuestAuthDtoSchema } from '../dtos/auth.dto';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(RegisterDtoSchema), controller.register);
router.post('/login', validate(LoginDtoSchema), controller.login);
router.post('/guest', validate(GuestAuthDtoSchema), controller.guestLogin);
router.post('/logout', authenticateToken, controller.logout);

export default router;
