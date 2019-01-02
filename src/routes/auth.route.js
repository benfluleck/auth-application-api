import { Router } from 'express';
import { signup, signin } from '../controllers/auth';
import checkFields from '../validators/checkFields';


export const authRouter = Router();

authRouter.post('/signin', checkFields, signin);

authRouter.post('/signup', checkFields, signup);
