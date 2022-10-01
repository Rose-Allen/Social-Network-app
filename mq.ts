const amqplib = require("amqplib");
import { Channel, Connection } from "amqplib";
require("dotenv").config({ path: __dirname + "/.env" });

const connect = async (): Promise<Channel> => {
  let channel: Channel, connection: Connection;

  const amqpServer = "amqp://localhost:5672";
  connection = await amqplib.connect(amqpServer);
  channel = await connection.createChannel();

  // make sure that the order channel is created, if not this statement will create it
  await channel.assertQueue("order");
  console.log("CONNECTED");
  return channel;
};

exports.connect = connect;
