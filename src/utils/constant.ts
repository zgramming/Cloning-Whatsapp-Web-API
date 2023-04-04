export const CODE_PRIVATE_GROUP = ({ yourId, userId }: { yourId: string; userId: string }) => {
  return `PRIVATE_${yourId}_${userId}`;
};
