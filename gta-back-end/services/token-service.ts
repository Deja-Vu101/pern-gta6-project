import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class TokenService {
  generateTokens(payload: string | object) {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error("JWT_SECRET environment variable is not set.");
    }
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await prisma.token.findFirst({
      where: { userId: userId },
    });

    if (tokenData) {
      const updateToken = await prisma.token.update({
        where: {
          id: tokenData.id,
        },
        data: {
          refreshToken: refreshToken,
        },
      });

      return updateToken;
    } else {
      const newToken = await prisma.token.create({
        data: {
          userId: userId,
          refreshToken: refreshToken,
        },
      });

      return newToken;
    }
  }
}

export default new TokenService();
