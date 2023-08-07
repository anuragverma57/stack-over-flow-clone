import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Users from "../models/auth.js";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await Users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already exist" });
    }
    const opt = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      opt,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    var mail = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abhasm58@gmail.com",
        pass: "hvrifjdcymkdhmuf",
      },
    });
    const mailoption = {
      from: "abhasm58@gmail.com",
      to: email,
      subject: "VERIFY YOUR EMAIL",
      html: `<p>OTP for asking a Question is  <b>${opt}</b> in the Stack-Over-Flow Clone website.  It will expires in 1 hour</p>`,
    };
    mail.sendMail(mailoption, (err) => {
      if (err) return console.log(err);
      else return console.log("email sent");
    });
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingser = await Users.findOne({ email });
    if (!existingser) {
      return res.status(404).json({ message: "User don't exist" });
    }
    const isPasswordCrt = await bcrypt.compare(password, existingser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const token = jwt.sign(
      { email: existingser.email, id: existingser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

const sendOptverificationmail = async (req, res) => {
  const { email } = req.body;
  try {
    const opt = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailoption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "VERIFY YOUR EMAIL",
      html: `<p>Enter <b>${opt}</b> in the StackOverFlow Clone website to verify your email.   IT WILL EXPIRE IN ONE HOUR</p>`,
    };
    const saltRound = 10;
    const hashesOPT = await bcrypt.hash(opt, saltRound);
  } catch (error) {
    console.log(error);
  }
};
