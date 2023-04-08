import {
  PATH_TEMPORARY_AVARTAR,
  PATH_TEMPORARY_GROUP_IMAGE_PROFILE,
  WHITELIST_IMAGE_MIME_TYPE,
} from './utils/constant';
import { FN } from './utils/function';

const userAvatarUpload = FN.multerUploadConfig({
  destination: PATH_TEMPORARY_AVARTAR,
  limitFileSize: FN.maxSizeInMB(1),
  config: { whitelistMimeType: WHITELIST_IMAGE_MIME_TYPE },
});

const groupGroupAvatarUpload = FN.multerUploadConfig({
  destination: PATH_TEMPORARY_GROUP_IMAGE_PROFILE,
  limitFileSize: FN.maxSizeInMB(1),
  config: { whitelistMimeType: WHITELIST_IMAGE_MIME_TYPE },
});

export { userAvatarUpload, groupGroupAvatarUpload };
