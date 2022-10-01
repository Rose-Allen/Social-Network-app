import { Express, Response, Request } from "express";
const userController = require("../../controllers/userController");
const Router = require("express");

const router: Express = new Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/checkAuth", userController.checkAuth);

module.exports = router;
