import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ApiError } from "../exceptions/api-error";
import { IValidateToken } from "../interfaces";

const prisma = new PrismaClient();

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

class TokenService {
  generateTokens(payload: string | object) {
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

  validateAccessToken(token: string) {
    try {
      if (accessTokenSecret) {
        const decodedToken = jwt.verify(token, accessTokenSecret) as JwtPayload;

        const userData: IValidateToken = {
          email: decodedToken.email,
          id: decodedToken.id,
          roleNames: decodedToken.roleName,
          isActivated: decodedToken.isActivated,
          iat: decodedToken.iat as number,
          exp: decodedToken.exp as number,
        };

        return userData;
      }
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<IValidateToken | null> {
    try {
      if (!refreshTokenSecret) {
        console.error("JWT_REFRESH_SECRET is not defined");
        throw ApiError.Unauthorized();
      }

      const decodedToken = jwt.verify(token, refreshTokenSecret) as JwtPayload;

      const userData: IValidateToken = {
        email: decodedToken.email,
        id: decodedToken.id,
        roleNames: decodedToken.roleNames,
        isActivated: decodedToken.isActivated,
        iat: decodedToken.iat as number,
        exp: decodedToken.exp as number,
      };

      return userData;
    } catch (error) {
      return null;
    }
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

  async deleteToken(refreshToken: string) {
    const deletedToken = await prisma.token.deleteMany({
      where: {
        refreshToken: refreshToken,
      },
    });

    return deletedToken;
  }
  async findToken(refreshToken: string) {
    const foundToken = await prisma.token.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    return foundToken;
  }
}

export default new TokenService();
