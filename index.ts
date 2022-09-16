import { Express, Response, Request } from "express";
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const errorHandling = require("./middlewares/ErrorHandlingMiddleware");
const sequelize = require("./db");
require("dotenv").config({ path: __dirname + "/.env" });

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(errorHandling);
app.use("/api", router);

router.delete("/:id", (req: Request, res: Response) => {
  res.sendStatus(200);
});

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  } catch (e) {
    console.log(e as Error);
  }
};

start();
