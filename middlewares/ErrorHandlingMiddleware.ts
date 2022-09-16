import { Response, Request, NextFunction } from "express";
const ApiError = require("../error/ApiError");

module.exports = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(ApiError.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
};
