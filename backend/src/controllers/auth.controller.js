import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    //Validate the data
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    //Validate the length of password
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    //check if the user is already exist or not
    const isUserexist = await User.findOne({ email });

    if (isUserexist) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    //create user in database
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate token
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,

      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile Pic is required' });
    }

    //upload image to cloudinary
    const result = await cloudinary.uploader.upload(profilePic);

    //update profile pic in database
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: result.secure_url,
      },
      { new: true }
    );

    if (updateUser) {
      res.status(200).json(updateUser);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in updateProfile controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
