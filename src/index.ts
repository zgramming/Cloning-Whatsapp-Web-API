import { Router } from 'express';
import { body, param } from 'express-validator';
import multer from 'multer';

import { AuthController } from './controllers/auth.controller';
import { ContactController } from './controllers/contact.controller';
import { GroupController } from './controllers/group.controller';
import { MessageController } from './controllers/message.controller';
import { UserController } from './controllers/user.controller';
import { validateToken } from './middlewares/validate-token.middleware';
import { PATH_TEMPORARY_AVARTAR, WHITELIST_IMAGE_MIME_TYPE } from './utils/constant';
import { CustomError, errorHandler } from './utils/error.helper';
import { expressValidatorCheck } from './utils/express-validator.helper';
import { FN } from './utils/function';

const router = Router();
const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: PATH_TEMPORARY_AVARTAR,
    filename: (req, file, cb) => {
      cb(null, FN.uniqueFilename(file));
    },
  }),
  fileFilter(req, file, callback) {
    const mime = file.mimetype;
    if (!WHITELIST_IMAGE_MIME_TYPE.includes(mime)) {
      const availableMime = WHITELIST_IMAGE_MIME_TYPE.join(', ');
      callback(CustomError(`Invalid Type ${mime}, Available Type ${availableMime}`, 400));
    }

    callback(null, true);
  },
  limits: {
    fileSize: FN.maxSizeInMB(1),
  },
});

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
    avatarUpload.single('avatar')(req, res, (err) => {
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
