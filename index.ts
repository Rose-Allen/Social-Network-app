import { Express, Response, Request } from "express";
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  } catch (e) {
    console.log(e as Error);
  }
};

start();
