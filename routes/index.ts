import { Express, Response, Request } from "express";
const Router = require("express");
const userRouter = require("./userRouter/index");

const router: Express = new Router();

router.use("/user", userRouter);

module.exports = router;
