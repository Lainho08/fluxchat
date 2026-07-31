import { Router } from 'express';
import { InterestController } from '../controllers/interest.controller';
import { validate } from '../middlewares/validate.middleware';
import { CreateInterestDtoSchema } from '../dtos/interest.dto';

const router = Router();
const controller = new InterestController();

router.get('/', controller.getAll);
router.post('/', validate(CreateInterestDtoSchema), controller.create);

export default router;
