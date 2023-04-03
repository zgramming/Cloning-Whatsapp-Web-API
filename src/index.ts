import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthController } from './controllers/auth.controller';
import { GroupController } from './controllers/group.controller';
import { UserController } from './controllers/user.controller';
import { expressValidatorCheck } from './utils/express-validator.helper';

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

router.get('/group', GroupController.getAllGroups);
router.get('/group/:id', param('id').isString().isUUID(), expressValidatorCheck, GroupController.getGroupById);
router.get('/group/code/:code', param('code').isString(), expressValidatorCheck, GroupController.getGroupByCode);
router.post(
  '/group',
  body('name').isString(),
  body('code').isString(),
  body('type').isString(),
  body('avatar').optional().isString(),
  expressValidatorCheck,
  GroupController.createGroup,
);
router.put(
  '/group/:id',
  param('id').isString().isUUID(),
  body('name').isString(),
  body('avatar').optional().isString(),
  expressValidatorCheck,
  GroupController.updateGroup,
);
router.delete('/group/:id', param('id').isString().isUUID(), expressValidatorCheck, GroupController.deleteGroup);

// Group Member routes

// Message routes

export default router;
