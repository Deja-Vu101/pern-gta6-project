import express from "express";
import cors from "cors";
import router from "./router";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error-middleware";
import { setupSwagger } from "./swagger";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.use(errorMiddleware);

setupSwagger(app);

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
