import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const AUTH_HEADER_PREFIX = 'Bearer ';

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
  };
}

export const generateToken = (username: string) => {
  const secret = env.auth.jwtSecret;
  return jwt.sign({ sub: username }, secret, { expiresIn: '8h' });
};

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(AUTH_HEADER_PREFIX)) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const token = header.substring(AUTH_HEADER_PREFIX.length);
  try {
    const secret = env.auth.jwtSecret;
    const decoded = jwt.verify(token, secret) as { sub?: string };
    req.user = { username: decoded.sub || 'user' };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' },
    });
  }
};

