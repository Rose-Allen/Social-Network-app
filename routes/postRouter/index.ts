import { Express, Response, Request } from "express";
const postController = require("../../controllers/postController");
const Router = require("express");

const router: Express = new Router();

router.post("/", postController.create);
router.get("/:id", postController.getImagePost);
router.delete("/", postController.remove);
router.put("/", postController.edit);
router.get("/", postController.getAllPosts);

module.exports = router;
