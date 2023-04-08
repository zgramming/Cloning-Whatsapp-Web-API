export const CODE_PRIVATE_GROUP = ({ yourId, userId }: { yourId: string; userId: string }) => {
  return `PRIVATE_${yourId}_${userId}`;
};

export const CODE_GROUP_GROUP = (creatorId: string) => {
  const randomString = Math.round(Math.random() * 1e9);
  const date = new Date();
  const dateFormat = date.toLocaleDateString('id-ID', {
    dateStyle: 'full',
  });
  const timeFormat = date.toLocaleTimeString('id-ID', {
    timeStyle: 'medium',
  });

  const uniqueName = `GROUP_${creatorId}_${randomString}_${dateFormat}_${timeFormat}`;

  return uniqueName;
};

// Socket IO Emmit Event
export const EMIT_EVENT_CONNECT = 'connected';
export const EMIT_EVENT_DISCONNECT = 'disconnect';
export const EMIT_EVENT_CUSTOM_DISCONNECT = 'custom_disconnected';
export const EMIT_EVENT_TYPING = 'typing';
export const EMIT_EVENT_SEND_MESSAGE = 'send_message';
export const EMIT_EVENT_INVITE_NEW_GROUP = 'invite_new_group';

// Path Upload
const PATH_TEMPORARY = './public/temporary';
const PATH_UPLOAD = './public/upload';

export const PATH_TEMPORARY_AVARTAR = `${PATH_TEMPORARY}/avatar`;
export const PATH_ACTUAL_AVARTAR = `${PATH_UPLOAD}/avatar`;

export const PATH_TEMPORARY_GROUP_IMAGE_PROFILE = `${PATH_TEMPORARY}/group/profile`;
export const PATH_ACTUAL_GROUP_IMAGE_PROFILE = `${PATH_UPLOAD}/group/profile`;

// File Type
export const WHITELIST_IMAGE_MIME_TYPE = ['image/png', 'image/jpeg', 'image/jpg'];
