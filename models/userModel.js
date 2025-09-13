import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  referralCode: {
    type: String,
    required: false,
  },
  batch: {
    type: String,
    required: true,
    enum: ['2021', '2022', '2023'], 
  },
});

const User = mongoose.model("User", userSchema);

export default User;
