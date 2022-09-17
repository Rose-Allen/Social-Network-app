import { Response, Request } from "express";
const userService = require("../services/userService");

class UserController {
  register = async (req: Request, res: Response): Promise<void> => {
    const { email, name, password } = req.body;
    const userData = await userService.register();
    res.json(userData);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    res.send("ХЕЛЛОУ ВОРЛДЕ");
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.send("ХЕЛЛОУ ВОРЛДЕ");
  };

  checkAuth = async (req: Request, res: Response): Promise<void> => {
    res.send("ХЕЛЛОУ ВОРЛДЕ");
  };
}

module.exports = new UserController();
