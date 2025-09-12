const express = require("express");
const aiRoutes = require("./src/routes/ai.routes");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "https://code-review-zeta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/ai", aiRoutes);

module.exports = app;
