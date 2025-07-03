const express = require("express");
const { getProducts, getProductById } = require("./db");
const Redis = require("ioredis");

//app
const app = express();
const port = 8000;
//redis
const redis = new Redis({
  host: "localhost",
  port: 6379,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// cache controlling
app.get("/products", async (req, res) => {
  try {
    // Check and send from Redis
    const exists = await redis.exists("products");

    if (exists) {
      const cached = await redis.get("products");
      console.log("From Redis");
      return res.send(JSON.parse(cached));
    }

    // Get from DB
    const products = await getProducts();

    // Set in Redis (with optional TTL, e.g. 60 seconds)
    await redis.set("products", JSON.stringify(products), "EX", 60);

    console.log("From DB");
    res.send(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// cache controlling
app.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const key = "products:" + id;
    // Check and send from Redis
    const exists = await redis.exists(key);

    if (exists) {
      const cached = await redis.get(key);
      console.log("From Redis");
      return res.send(JSON.parse(cached));
    }

    // Get from DB
    const product = await getProductById(id);

    // Set in Redis (with optional TTL, e.g. 60 seconds)
    await redis.set(key, JSON.stringify(product), "EX", 60);

    console.log("From DB");
    res.send(product);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

redis.on("connect", () => {
  console.log("Redis connection successful!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
