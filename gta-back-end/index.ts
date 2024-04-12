import express from "express";
import cors from "cors";
import router from "./router";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
