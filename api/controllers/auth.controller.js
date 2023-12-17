import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ username, email, password : hashedPassword });
    await newUser.save();
    res.status(200).send({
      success : true,
      message: "User was registered successfully!",
      data : newUser
    })
  } catch (err) {
      console.log(err);
      res.status(500).send({
         success : false,
         message : 'Error in signup',
         err
      });
  }
};
