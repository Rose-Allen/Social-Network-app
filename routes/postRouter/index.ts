import { Express, Response, Request } from "express";
const postController = require("../../controllers/postController");
const Router = require("express");

const router: Express = new Router();

router.post("/", postController.create);

module.exports = router;
