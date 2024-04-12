import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import tokenService from "./token-service";
import UserDto from "../dto/user-dto";
import emailService from "./email-service";

const prisma = new PrismaClient();

class UserService {
  async registration(email: string, password: string) {
    const newUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (newUser) throw new Error("User with this email exists");

    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        activationLink: activationLink,
      },
    });

    await emailService.sendLetter(
      email,
      `${process.env.API_URL}activate/${activationLink}`
    );

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

    if (!existUser) throw new Error("This user is not registered");

    const isPasswordMatch = await bcrypt.compare(password, existUser.password);

    if (!isPasswordMatch) throw new Error("Your password is incorrect");

    const userDto = new UserDto(existUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      ...tokens,
    };
  }
}
export default new UserService();
