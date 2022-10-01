import { Response, Request, NextFunction } from "express";
const ApiError = require("../error/ApiError");
const userService = require("../services/userService");

class UserController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        email_address,
        password,
        country,
        date_of_birth,
        given_name,
        surname,
      } = req.body;
      const userData = await userService.register(
        email_address,
        password,
        country,
        date_of_birth,
        given_name,
        surname
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email_address, password } = req.body;
      const userData = await userService.login(email_address, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный логин или пароль"));
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.send("ХЕЛЛОУ ВОРЛДЕ");
  };

  checkAuth = async (req: Request, res: Response): Promise<void> => {
    res.send("ХЕЛЛОУ ВОРЛДЕ");
  };
}

module.exports = new UserController();
