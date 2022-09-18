import { Response, Request, NextFunction } from "express";
const ApiError = require("../error/ApiError");
const postService = require("../services/postService");
const imageService = require("../services/imageService");

interface uploadRequest extends Request {
  files: any;
}

class PostController {
  create = async (
    req: uploadRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, text } = req.body;
      const { media } = req.files;
      const postData = await postService.create(userId, text, media);
      res.json(postData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };

  getImagePost = async (
    req: uploadRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const postImage = await imageService.getImage(id);
      postImage.pipe(res);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };

  getAllPosts = async (
    req: uploadRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const postData = await postService.getAllPosts();
      res.json(postData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };

  remove = async (
    req: uploadRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.query;
      const postData = await postService.remove(id);
      res.json(postData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };

  edit = async (
    req: uploadRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, text } = req.body;
      const { media } = req.files;
      const postData = await postService.edit(id, text, media);
      res.json(postData);
    } catch (e) {
      return next(ApiError.badRequest("Неверный запрос"));
    }
  };
}

module.exports = new PostController();
