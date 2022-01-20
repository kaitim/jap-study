const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const vocabs = require("./routers/vocabs");
const mongoose = require("mongoose");
const config = require("config");

app.use(express.json());

app.use("/api/vocabs", vocabs);

mongoose
  .connect(config.get("db"))
  .then(() => console.log(`connecting to mongoose ${config.get("db")}`))
  .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
module.exports = server;
