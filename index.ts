import { Express, Response, Request } from "express";
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const sequelize = require("./db");
require("dotenv").config({ path: __dirname + "/.env" });

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

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
