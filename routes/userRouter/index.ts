import { Express, Response, Request } from "express";
const userController = require("../../controllers/userController");
const Router = require("express");

const router: Express = new Router();

router.post("/", userController.register);
router.post("/", userController.login);
router.get("/", userController.logout);
router.post("/", userController.checkAuth);

module.exports = router;
