const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const start = async () => {
  try {
    app.listen(4444, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("СЕРВАК РАБОТАЕТ!");
    });
  } catch (e) {
    console.log(e);
  }
};

start();
