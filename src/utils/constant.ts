export const CODE_PRIVATE_GROUP = ({ yourId, userId }: { yourId: string; userId: string }) => {
  return `PRIVATE_${yourId}_${userId}`;
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

// File Type
export const WHITELIST_IMAGE_MIME_TYPE = ['image/png', 'image/jpeg', 'image/jpg'];
