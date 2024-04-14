import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import tokenService from "./token-service";
import UserDto from "../dto/user-dto";
import emailService from "./email-service";
import { ApiError } from "../exceptions/api-error";
import userController from "../controllers/user-controller";

const prisma = new PrismaClient();

class UserService {
  async registration(email: string, password: string) {
    const newUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (newUser) {
      throw ApiError.BadRequest("User with this email exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        activationLink: activationLink,
      },
    });

    //await emailService.sendLetter(
    //  email,
    //  `${process.env.API_URL}activate/${activationLink}`
    //);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const existUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existUser) throw ApiError.BadRequest("This user is not registered");

    const isPasswordMatch = await bcrypt.compare(password, existUser.password);

    if (!isPasswordMatch)
      throw ApiError.BadRequest("Your password is incorrect");

    const userDto = new UserDto(existUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.deleteToken(refreshToken);

    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw ApiError.Unauthorized();

    const userData = await tokenService.validateRefreshToken(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);

    if (!userData || !dbToken) {
      throw ApiError.Unauthorized();
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userData.id,
      },
    });

    if (user) {
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        user: userDto,
        ...tokens,
      };
    }
  }
}
export default new UserService();
