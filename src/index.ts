import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthController } from './controllers/auth.controller';
import { ContactController } from './controllers/contact.controller';
import { ConversationController } from './controllers/conversation.controller';
import { MessageController } from './controllers/message.controller';
import { UserController } from './controllers/user.controller';
import { validateToken } from './middlewares/validate-token.middleware';
import { conversationGroupAvatarUpload, userAvatarUpload } from './multer.upload';
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
router.get('/user/me', validateToken, UserController.me);
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

// Conversation routes

router.get('/conversation/me', validateToken, ConversationController.getMyConversations);
router.get(
  '/conversation/:id',
  validateToken,
  param('id').isUUID(),
  expressValidatorCheck,
  ConversationController.getById,
);
router.get(
  '/conversation/code/:code',
  validateToken,
  param('code').isString(),
  expressValidatorCheck,
  ConversationController.getByCode,
);
router.post(
  '/conversation/private',
  validateToken,
  body('userId').isUUID(),
  expressValidatorCheck,
  ConversationController.createPrivateConversation,
);
router.post(
  '/conversation/group',
  validateToken,
  async (req, res, next) => {
    conversationGroupAvatarUpload.single('avatar')(req, res, (err) => {
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
  ConversationController.createGroupConversation,
);

router.put(
  '/conversation/:id',
  validateToken,
  param('id').isUUID(),
  body('name').isString(),
  body('avatar').optional().isString(),
  expressValidatorCheck,
  ConversationController.update,
);
router.delete(
  '/conversation/:id',
  validateToken,
  param('id').isUUID(),
  expressValidatorCheck,
  ConversationController.delete,
);

// Message routes

router.get(
  '/message/conversation/:conversation_id',
  validateToken,
  param('conversation_id').isUUID(),
  expressValidatorCheck,
  MessageController.getByConversationId,
);
router.post(
  '/message',
  validateToken,
  body('message').isString(),
  body('conversation_id').isUUID(),
  body('type').isString(),
  expressValidatorCheck,
  MessageController.createMessage,
);

// Contact routes

router.get('/contact/me', validateToken, ContactController.getContactsByOwnerId);

router.post(
  '/contact',
  validateToken,
  body('conversation_id').isUUID(),
  body('user_id').isUUID(),
  expressValidatorCheck,
  ContactController.createContact,
);

export default router;
