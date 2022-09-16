import { Response, Request } from "express";
const postService = require("../services/postService");

class PostController {
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, text, media } = req.body;
      const postData = await postService.create(userId, text, media);
      res.json(postData);
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = new PostController();
