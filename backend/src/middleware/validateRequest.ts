import { NextFunction, Request, Response } from 'express';

type Validator = (body: any) => { value?: any; error?: string };

export const validateRequest =
  (validator: Validator) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = validator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: error,
        },
      });
    }
    req.body = value;
    return next();
  };

