import { Request, Response, NextFunction } from "express";
import userService from "../services/user-service";
import emailService from "../services/email-service";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const userData = await userService.registration(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      console.log(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const userData = await userService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      console.log(error);
    }
  }

  async activateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { link } = req.params;

      await emailService.activateAccount(link);

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173/";
      res.redirect(clientUrl);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserController();
