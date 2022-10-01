const redis = require("redis");
require("dotenv").config({ path: __dirname + "/.env" });

const redisClient = redis.createClient(6379, `${process.env.DB_HOST}`);

const start = async (): Promise<void> => {
  redisClient.on("error", (error: Error) => console.error(`Error : ${error}`));

  await redisClient.connect();
  console.log("Redis connected");
};

start();

module.exports = redisClient;
