import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js';
import { getReceiverSocketId } from '../utils/socket.js';
import { io } from '../utils/socket.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    if (filterUsers) {
      res.status(200).json(filterUsers);
    }
  } catch (error) {
    console.log('Error in getUsersForSidebar controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { _id: myId } = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { _id: senderId } = req.user;
    const { text, image } = req.body;

    let imageUrl = '';
    if (image) {
      //upload image to cloudinary
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(200).json(newMessage);

    //realtime fucntionality goes here=> soket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }
  } catch (error) {
    console.log('Error in sendMessage controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
