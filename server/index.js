require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "good" });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`server on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();