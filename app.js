import express from "express";
import { config } from "dotenv";
import paymentRoute from "./routes/paymentRoutes.js";
import userRoute from "./routes/userRoute.js";
import { Payment } from "./models/paymentModel.js";
import { Checkin } from "./models/checkinModel.js";
import cors from "cors";

config({ path: "./config/config.env" });

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", paymentRoute);
app.use("/api", userRoute);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.get('/api/validateReferenceNumber', async (req, res) => {
  try {
    const { ref } = req.query; 
    const payment = await Payment.findOne({ razorpay_payment_id: ref }); 

    if (payment) {
      res.status(200).json({ valid: true });
    } else {
      res.status(404).json({ valid: false, error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error validating reference number:', error);
    res.status(500).json({ valid: false, error: 'Internal server error' });
  }
});

app.post('/api/checkin', async (req, res) => {
  try {
    const { referenceNumber } = req.body;

   
    const payment = await Payment.findOne({ razorpay_payment_id: referenceNumber }); 

    if (!payment) {
      return res.status(404).json({ message: 'Invalid reference number' });
    }

   
    const existingCheckin = await Checkin.findOne({ referenceNumber });

    if (existingCheckin) {
      return res.status(400).json({ message: 'Reference number already checked in' });
    }

    
    const newCheckin = new Checkin({ referenceNumber });
    await newCheckin.save();
      
    res.status(200).json({ message: 'Check-in successful' });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
