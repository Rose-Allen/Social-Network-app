const jwt = require("jsonwebtoken");
const path = require("path");
const tokenModel = require("../models/token-module");
require("dotenv").config({ path: `${path.resolve(__dirname, "..", ".env")}` });

class tokenService {
  generateTokens = async (userData: object): Promise<object> => {
    const accessToken = jwt.sign(
      userData,
      process.env.JWT_ACCESS_TOKEN_PASSWORD,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign(
      userData,
      process.env.JWT_REFRESH_TOKEN_PASSWORD,
      {
        expiresIn: "14d",
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  saveToken = async (userId: string, refreshToken: string) => {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await tokenModel.create({
      user: userId,
      refreshToken,
    });

    return token;
  };

  validateAccessToken = async (token: string) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_PASSWORD);
      return userData;
    } catch (err) {
      return null;
    }
  };

  validateRefreshToken = (token: string) => {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_TOKEN_PASSWORD
      );
      return userData;
    } catch (err) {
      return null;
    }
  };

  removeToken = async (refreshToken: string) => {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  };

  findToken = async (refreshToken: string) => {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  };
}

module.exports = new tokenService();

export {};
