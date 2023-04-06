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
