import { Express, Response, Request } from "express";
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandling = require("./middlewares/ErrorHandlingMiddleware");
const sequelize = require("./db");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("dotenv").config({ path: __dirname + "/.env" });

const swaggerDocument = YAML.load("./swagger.yaml");

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(errorHandling);
app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.delete("/:id", (req: Request, res: Response) => {
  res.sendStatus(200);
});

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("Mongo connected");
      }
    );
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
