import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db';

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, "123" as string);

      const result = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.id]);

      if (result.rows.length === 0) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = { id: result.rows[0].id };
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export default protect;
