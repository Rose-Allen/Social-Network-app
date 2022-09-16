import { Express, Response, Request } from "express";
const Router = require("express");
const userRouter = require("./userRouter/index");
const postRouter = require("./postRouter/index");
const models = require("../models/model");

const router: Express = new Router();

router.use("/user", userRouter);
router.use("/post", postRouter);

module.exports = router;
