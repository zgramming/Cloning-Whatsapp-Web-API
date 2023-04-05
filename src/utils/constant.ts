export const CODE_PRIVATE_GROUP = ({ yourId, userId }: { yourId: string; userId: string }) => {
  return `PRIVATE_${yourId}_${userId}`;
};

// Socket IO Emmit Event
export const EMIT_EVENT_CONNECT = 'connected';
export const EMIT_EVENT_DISCONNECT = 'disconnected';
