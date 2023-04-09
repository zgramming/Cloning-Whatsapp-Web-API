import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthController } from './controllers/auth.controller';
import { ContactController } from './controllers/contact.controller';
import { GroupController } from './controllers/group.controller';
import { MessageController } from './controllers/message.controller';
import { UserController } from './controllers/user.controller';
import { validateToken } from './middlewares/validate-token.middleware';
import { groupGroupAvatarUpload, userAvatarUpload } from './multer.upload';
import { CustomError, errorHandler } from './utils/error.helper';
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
router.get('/user/:id', param('id').isUUID(), expressValidatorCheck, UserController.getUser);
router.get(
  '/user/phone/:phone',
  param('phone').isString(),
  expressValidatorCheck,
  validateToken,
  UserController.getUserByPhone,
);
router.post(
  '/user',
  body('name').isString(),
  body('phone').isString(),
  body('password').isString(),
  expressValidatorCheck,
  UserController.createUser,
);
router.put(
  '/user',
  validateToken,
  body('name').isString(),
  body('bio').optional().isString(),
  expressValidatorCheck,
  UserController.updateUser,
);
router.put(
  '/user/picture',
  validateToken,
  (req, res, next) => {
    userAvatarUpload.single('avatar')(req, res, (err) => {
      const file = req.file;
      if (err) return errorHandler(err, req, res);

      if (!file) {
        return errorHandler(CustomError('Avatar is required', 400), req, res);
      }
      next();
    });
  },
  UserController.updatePicture,
);
router.delete('/user/:id', validateToken, UserController.deleteUser);

// Group routes

router.get('/group/me', validateToken, GroupController.getMyGroups);
router.get('/group/:id', validateToken, param('id').isUUID(), expressValidatorCheck, GroupController.getGroupById);
router.get(
  '/group/code/:code',
  validateToken,
  param('code').isString(),
  expressValidatorCheck,
  GroupController.getGroupByCode,
);
router.post(
  '/group/private',
  validateToken,
  body('userId').isUUID(),
  expressValidatorCheck,
  GroupController.createPrivateGroup,
);
router.post(
  '/group/group',
  validateToken,
  async (req, res, next) => {
    groupGroupAvatarUpload.single('avatar')(req, res, (err) => {
      if (err) return errorHandler(err, req, res);
      next();
    });
  },
  body('name').isString(),
  body('participants')
    .isArray({
      min: 1,
    })
    .withMessage('Participants must be an array of UUIDs and must have at least one participant'),
  expressValidatorCheck,
  GroupController.createGroupGroup,
);
router.post(
  '/group',
  validateToken,
  body('name').isString(),
  body('code').isString(),
  body('type').isString(),
  body('avatar').optional().isString(),
  expressValidatorCheck,
  GroupController.createGroup,
);
router.put(
  '/group/:id',
  validateToken,
  param('id').isUUID(),
  body('name').isString(),
  body('avatar').optional().isString(),
  expressValidatorCheck,
  GroupController.updateGroup,
);
router.delete('/group/:id', validateToken, param('id').isUUID(), expressValidatorCheck, GroupController.deleteGroup);

// Message routes

router.get(
  '/message/group/:groupId',
  validateToken,
  param('groupId').isUUID(),
  expressValidatorCheck,
  MessageController.getMessagesByGroupId,
);
router.post(
  '/message',
  validateToken,
  body('message').isString(),
  body('group_id').isUUID(),
  body('type').isString(),
  expressValidatorCheck,
  MessageController.createMessage,
);

// Contact routes

router.get('/contact/me', validateToken, ContactController.getContactsByOwnerId);

router.post(
  '/contact',
  validateToken,
  body('group_id').isUUID(),
  body('user_id').isUUID(),
  expressValidatorCheck,
  ContactController.createContact,
);

export default router;
