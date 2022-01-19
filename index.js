const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const vocabs = require("./routers/vocabs");

app.use(express.json());

app.use("/api/vocabs", vocabs);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
