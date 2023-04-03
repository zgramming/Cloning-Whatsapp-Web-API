import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

type VerifyTokenType = {
  req: Request;
  onErrorToken?: (message: string) => void;
  onErrorVerify?: (message: string) => void;
};

const generateToken = (userId: string) => {
  const secretKey = process.env.JWT_SECRECT_KEY ?? '-';
  const token = jwt.sign(
    {
      payload: {
        userId,
      },
    },
    secretKey,
    { expiresIn: '1 days' },
  );

  return token;
};

const verifyToken = ({ req, onErrorToken, onErrorVerify }: VerifyTokenType): string | undefined => {
  const secretKey = process.env.JWT_SECRECT_KEY ?? '';

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    onErrorToken?.('Token is required');
    return;
  }

  const decoded = jwt.verify(token, secretKey);
  const { payload } = decoded as JwtPayload;
  const { userId } = payload;

  if (!userId) {
    onErrorVerify?.('Unauthorized');
    return;
  }

  return userId;
};

export { generateToken, verifyToken };
