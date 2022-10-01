import { Channel } from "amqplib";
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const tokenService = require("./tokenService");
const { User } = require("../models/model");
const UserDto = require("../dtos/userDto");
const bcrypt = require("bcrypt");
const { connect } = require("../mq");

class UserService {
  register = async (
    email_address: string,
    password: string,
    country: string,
    date_of_birth: string,
    given_name: string,
    surname: string
  ): Promise<object> => {
    const t = await sequelize.transaction();
    try {
      const passwordHash = await bcrypt.hash(password, 3);

      const userData = await User.create(
        {
          email_address,
          password: passwordHash,
          country,
          date_of_birth,
          given_name,
          surname,
        },
        { transaction: t }
      );
      const condidat = await User.findOne({ where: { email_address } });
      console.log("condidat ", condidat);
      if (condidat) {
        throw ApiError.badRequest("Неверный пароль или логин");
      }

      let channel: Channel = await connect();

      // make sure that the order channel is created, if not this statement will create it
      await channel.assertQueue("order");

      channel.sendToQueue(
        "order",
        Buffer.from(
          JSON.stringify({
            ...userData,
          })
        )
      );

      const userDto = new UserDto(userData.dataValues);

      const tokens = await tokenService.generateTokens({ ...userDto });

      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      await t.commit();

      return { ...tokens, ...userDto };
    } catch (e) {
      await t.rollback();
      console.log(e);
      if (e) {
        throw ApiError.badRequest("Неверный запрос");
      }
      return {};
    }
  };

  login = async (email_address: string, password: string): Promise<object> => {
    const t = await sequelize.transaction();
    try {
      const userData = await User.findOne({ where: { email_address } });
      const compare = await bcrypt.compare(
        password,
        userData.dataValues.password
      );

      if (!userData.dataValues || !compare) {
        throw ApiError.badRequest("Неверный логин или пароль");
      }

      const userDto = new UserDto(userData.dataValues);

      const tokens = await tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      await t.commit();

      return { ...tokens, ...userDto };
    } catch (e) {
      await t.rollback();
      console.log(e);
      if (e) {
        throw ApiError.badRequest("Неверный запрос");
      }
      return {};
    }
  };

  logout = async (): Promise<void> => {};

  checkAuth = async (): Promise<void> => {};
}

module.exports = new UserService();

export {};
