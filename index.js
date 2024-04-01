import cors from "cors";
import express from "express";

import { PORT } from "./config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: true, msg: "Hello from Test Route" });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
