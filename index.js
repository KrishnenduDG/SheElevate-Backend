import cors from "cors";
import express from "express";

import { PORT } from "./config.js";

import { firebaseAuth, regCheck } from "./middlewares/index.js";

import {
  businessRouter,
  misclRouter,
  userRouter,
  workspaceRouter,
} from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", firebaseAuth, regCheck, (req, res) => {
  res.json({ status: true, msg: "Hello from Test Route.. Hi" });
});

app.use("/business", businessRouter);
app.use("/user", userRouter);
app.use("/", misclRouter);
app.use("/workspace", workspaceRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
