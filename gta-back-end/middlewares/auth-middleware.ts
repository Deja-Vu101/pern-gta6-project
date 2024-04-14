import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api-error";
import tokenService from "../services/token-service";

interface AuthRequest extends Request {
  user?: any;
}
export default function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) return next(ApiError.Unauthorized());

    const authorizationToken = authorization.split(" ")[1];
    const userData = tokenService.validateAccessToken(authorizationToken);

    if (!userData) return next(ApiError.Unauthorized());

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.Unauthorized());
  }
}
