import { Response, Request, NextFunction } from "express";
const ApiError = require("../error/ApiError");
const postService = require("../services/postService");

class PostController {
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, text, media } = req.body;
      const postData = await postService.create(userId, text, media);
      res.json(postData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };
}

module.exports = new PostController();
