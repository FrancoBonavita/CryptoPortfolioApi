// src/middlewares/validation.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

// Generic — works with any Zod schema, not just assets.
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      res.status(400).json({ success: false, errors });
      return;
    }

    req.body = result.data;
    next();
  };
}