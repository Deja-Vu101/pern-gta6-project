import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api-error";
import tokenService from "../services/token-service";
import { AuthRequest, IValidateToken } from "../interfaces";

export default function roleMiddleware(roles: string[]) {
  return function (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;
      console.log(authorization, "authorization");

      if (!authorization) return next(ApiError.Unauthorized());

      const authorizationToken = authorization.split(" ")[1];
      const userData = tokenService.validateAccessToken(authorizationToken);
      console.log(userData, "USEDATA validateAccessToken");

      if (!userData || userData === undefined || userData === null)
        return next(ApiError.Unauthorized());

      const hasMatchRoleRequests = userData.roleNames.some((role: string) =>
        roles.includes(role)
      );

      if (!hasMatchRoleRequests)
        return next(ApiError.Unauthorized("You don't have access"));

      req.user = userData;
      next();
    } catch (error) {
      return next(ApiError.Unauthorized());
    }
  };
}
