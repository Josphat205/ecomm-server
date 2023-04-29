import express from "express";
const router = express.Router();
import UserModel from "../models/Users.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

router.use(cors());
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname, image } = req.body;
    const notExist = await UserModel.findOne({ email });
    if (notExist) {
      res.json({ message: "Email already exists" });
    }
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new UserModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      image
    });
    const data = await newUser.save();
    res.json({ message: "user created successfully, login now!!", data });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }
  const validPassword = await bcryptjs.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "wrong password or email" });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({
    message: "user logged in successfully",
    token,
    id: user._id,
    image: user.image,
    email: user.email
  });
});

export { router as userRouter };
