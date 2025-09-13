import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    required: true,
    unique: true 
  }
  
});

export const Checkin = mongoose.model("Checkin", checkinSchema);
