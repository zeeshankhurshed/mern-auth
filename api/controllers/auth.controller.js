import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
export const signup=async(req,res,next)=>{
  const {username, email,password}=req.body;
  const hashedPassword=bcryptjs.hashSync(password,10);
  const newUser=new User({username,email,password:hashedPassword});
  try {
      await newUser.save();
      res.status(201).json({message:"User created successfully"})
    
  } catch (error) {
    // res.status(500).json(error.message)
    // next(error);
    // next(errorHandler(300, "something went wrong"));custom error
    next(error);
  }
}
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

    // Set token expiry time (e.g., 1 hour)
    const tokenExpiry = '1h';
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });

    // Set cookie expiry time (e.g., 1 hour in milliseconds)
    const cookieExpiry = 60 * 60 * 1000;

    // Remove password fields from the response
    const { password: pwd, hashedPassword, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true, maxAge: cookieExpiry })
       .status(200)
       .json(rest);
  } catch (error) {
    next(error);
  }
};



export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    // Find user by email
    let user = await User.findOne({ email });

    if (user) {
      // Existing user: create a JWT token and set it in a cookie
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password, ...rest } = user._doc;

      res.cookie('access_token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000), // 1 hour expiry
      }).status(200).json({ user: rest });
    } else {
      // New user: create user and set a JWT token
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString(),
        email: email,
        password: hashedPassword,
        profilePicture: photo
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: hashedPassword2, ...rest } = newUser._doc;

      res.cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000), // 1 hour expiry
      }).status(201).json({ user: rest });
    }
  } catch (error) {
    next(error);
  }
};


export const signout=async(req,res)=>{
  res.clearCookie('Access_token').status(200).json('Signout success');
}