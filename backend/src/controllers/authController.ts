import { Request, Response } from 'express';
import { env } from '../config/env';
import { generateToken } from '../middleware/auth';

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: { message: 'username and password are required' },
    });
  }

  if (username !== env.auth.username || password !== env.auth.password) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid credentials' },
    });
  }

  const token = generateToken(username);

  return res.json({
    success: true,
    data: {
      token,
      user: { username },
    },
  });
};

