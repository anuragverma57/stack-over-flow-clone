import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import qusetionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import RazorPay from "razorpay";
import paymentRoutes from "./routes/payment.js";
// import postRoutes from './routes/Post.js'

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: "true" }));
app.use(express.urlencoded({ limit: "30mb", extended: "true" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a Stackoverflow Cloane API");
});

app.use("/user", userRoutes);
app.use("/questions", qusetionRoutes);
app.use("/answer", answerRoutes);
app.use("/payment", paymentRoutes);
// app.use("/post",postRoutes);

const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL;

console.log(process.env.RAZORPAY_APIKEY);
export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_APIKEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
mongoose.set("strictQuery", true);
mongoose
  .connect(DATABASE_URL, {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));

app.get("/payment/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_APIKEY })
);
