import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { productRouter } from "./routes/products.js";
import { paymentRouter } from "./routes/stripepayment.js";
dotenv.config();

const app = express();

//middleware
app.use(cors({ origin: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  })
);

//connect database
mongoose.connect(process.env.MONGODB_CONNECT_API);

//routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/stripe", paymentRouter);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`sever running in port: ${PORT}`));
