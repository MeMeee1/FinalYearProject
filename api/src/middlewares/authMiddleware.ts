import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    // decode jwt toke data
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) ;
    if (typeof decoded !== 'object' || !decoded?.userId) {
      res.status(401).json({ error: 'Access denied' });
      return;
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Access denied' });
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const role = req.role;
 if (req.role !== 'seller' && req.role !== 'admin') {
    res.status(403).json({ error: 'Seller access required' });
    return;
  }
  next();
}
export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

export function verifySellerOwnership(req: Request, res: Response, next: NextFunction) {
  if (req.role !== 'seller' && req.role !== 'admin') {
    res.status(403).json({ error: 'Seller doesn"t own this resource' });
    return;
  }
  next();
}
