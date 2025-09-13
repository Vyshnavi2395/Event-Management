import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import session from 'express-session';


const sessionMiddleware = session({
  secret: 'your-session-secret', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  }
});


const registerUser = async (req, res) => {
  try {
   
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { registrationNumber: req.body.registrationNumber }
      ]
    });

    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    const newUser = await User.create(req.body);

    
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', {
      expiresIn: '7d' // Set the expiration time for the token
    });

   
    res.cookie('token', token, {
      httpOnly: true, 
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    
    req.session.user = newUser;

    
    res.status(201).json(newUser);
  } catch (error) {
   
    res.status(500).json({ message: 'Server Error' });
  }
};


const getUser = async (req, res) => {
  try {
    const { email, registrationNumber } = req.query;

    const user = await User.findOne({
      $or: [
        { email },
        { registrationNumber }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { registerUser, getUser, sessionMiddleware };
