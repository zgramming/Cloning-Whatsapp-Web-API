import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { body, param } from 'express-validator';
import { expressValidatorCheck } from './utils/express-validator.helper';
import { AuthController } from './controllers/auth.controller';
const router = Router();

router.get('/', (req, res) => res.send('Express + TypeScript Server'));

router.post(
  '/login',
  body('phone').isString(),
  body('password').isString(),
  expressValidatorCheck,
  AuthController.login,
);

// User routes

router.get('/user', UserController.getAllUsers);
router.get('/user/:id', param('id').isString().isUUID(), expressValidatorCheck, UserController.getUser);
router.post(
  '/user',
  body('name').isString(),
  body('phone').isString(),
  body('password').isString(),
  expressValidatorCheck,
  UserController.createUser,
);
router.put(
  '/user/:id',
  param('id').isString().isUUID(),
  body('name').isString(),
  expressValidatorCheck,
  UserController.updateUser,
);

// Group routes

// Group Member routes

// Message routes

export default router;
