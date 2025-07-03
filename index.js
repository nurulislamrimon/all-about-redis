const express = require("express");
const { getProducts } = require("./db");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  res.send(await getProducts());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
