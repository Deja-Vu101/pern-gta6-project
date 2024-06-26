import { NextFunction, Request, Response } from "express";
import userService from "../services/user-service";
import emailService from "../services/email-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";
import tokenService from "../services/token-service";
import UserDto from "../dto/user-dto";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { email, password } = req.body;

      const userData = await userService.registration(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { email, password } = req.body;

      const userData = await userService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async activateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { link } = req.params;

      await emailService.activateAccount(link);

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173/";
      res.redirect(clientUrl);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const token = await userService.logout(refreshToken);

      res.clearCookie("refreshToken");

      res.json(token).status(200);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);

      res.cookie("refreshToken", userData, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async isLoginedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const user = await tokenService.validateRefreshToken(refreshToken);
      if (user) {
        const userDto = new UserDto(user);
        res.json(userDto).status(200);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
