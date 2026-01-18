import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import axios from "axios";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

/* ======================
   MongoDB Connection
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ======================
   Razorpay Instance
====================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ======================
   Email Configuration
====================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS  // App Password
  }
});

/* ======================
   WhatsApp Function
====================== */
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    // Using Twilio WhatsApp API
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        To: `whatsapp:${phoneNumber}`,
        Body: message
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN
        }
      }
    );
    console.log("WhatsApp sent:", response.data.sid);
  } catch (error) {
    console.error("WhatsApp error:", error.response?.data || error.message);
  }
}

/* ======================
   User Schema
====================== */
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

/* ======================
   Order Schema
====================== */
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: String,
  paymentId: String,
  amount: Number,
  currency: String,
  status: { type: String, default: "created" },
  items: Array,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

/* ======================
   Middleware - Auth
====================== */
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verified.id;
    } catch (err) {
      // Invalid token, but continue anyway
    }
  }
  next();
};

/* ======================
   REGISTER
====================== */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ======================
   LOGIN
====================== */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ======================
   CREATE RAZORPAY ORDER
====================== */
app.post("/api/create-order", optionalAuth, async (req, res) => {
  try {
    const { amount, currency, items, customerInfo } = req.body;

    // Create Razorpay order
    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order to database
    const order = new Order({
      userId: req.userId || null, // Optional userId
      orderId: razorpayOrder.id,
      amount: amount,
      currency: currency || "INR",
      status: "created",
      items: items,
      customerInfo: customerInfo
    });

    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* ======================
   VERIFY PAYMENT
====================== */
app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          status: "paid",
          paymentId: razorpay_payment_id
        },
        { new: true }
      );

      if (order) {
        // Send customer email
        const customerEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0C0C0C; padding: 30px; text-align: center;">
              <h1 style="color: #DCCA87; margin: 0;">Diamond Fragrance</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; margin-top: 20px;">
              <h2 style="color: #0C0C0C;">Order Confirmed! 🎉</h2>
              <p>Dear ${order.customerInfo.name},</p>
              <p>Thank you for your order! Your payment has been confirmed.</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #DCCA87;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
                <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${order.paymentId}</p>
                <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.amount}</p>
              </div>
              
              <h3 style="color: #0C0C0C; margin-top: 30px;">Order Items:</h3>
              ${order.items.map(item => `
                <div style="padding: 10px; border-bottom: 1px solid #eee;">
                  <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
                  <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}</p>
                </div>
              `).join('')}
              
              <h3 style="color: #0C0C0C; margin-top: 30px;">Delivery Address:</h3>
              <p style="margin: 5px 0;">${order.customerInfo.name}</p>
              <p style="margin: 5px 0;">${order.customerInfo.phone}</p>
              <p style="margin: 5px 0;">${order.customerInfo.address}</p>
              
              <p style="margin-top: 30px;">Your order will be delivered within 5-7 business days.</p>
              <p>If you have any questions, feel free to contact us.</p>
            </div>
            
            <div style="background-color: #0C0C0C; padding: 20px; text-align: center; margin-top: 20px;">
              <p style="color: #DCCA87; margin: 0;">Thank you for shopping with Diamond Fragrance!</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: order.customerInfo.email,
          subject: `Order Confirmed - ${order.orderId}`,
          html: customerEmailContent
        });

        // Send owner email
        const ownerEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #DCCA87;">🎊 New Order Received!</h2>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Payment ID:</strong> ${order.paymentId}</p>
            <p><strong>Amount:</strong> ₹${order.amount}</p>
            
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> ${order.customerInfo.name}</p>
            <p><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            <p><strong>Address:</strong> ${order.customerInfo.address}</p>
            
            <h3>Items:</h3>
            <ul>
              ${order.items.map(item => `
                <li>${item.name} - Qty: ${item.quantity} - ₹${item.quantity * item.price}</li>
              `).join('')}
            </ul>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.OWNER_EMAIL,
          subject: `New Order - ${order.orderId} - ₹${order.amount}`,
          html: ownerEmailContent
        });

        // Send WhatsApp to owner
        const whatsappMessage = `
🎉 NEW ORDER RECEIVED!

Order ID: ${order.orderId}
Amount: ₹${order.amount}

Customer: ${order.customerInfo.name}
Phone: ${order.customerInfo.phone}

Items:
${order.items.map(item => `• ${item.name} (${item.quantity}x) - ₹${item.quantity * item.price}`).join('\n')}

Address: ${order.customerInfo.address}
        `.trim();

        await sendWhatsAppMessage(process.env.OWNER_WHATSAPP, whatsappMessage);
      }

      res.json({ 
        message: "Payment verified successfully",
        success: true,
        order: order
      });
    } else {
      res.status(400).json({ 
        message: "Invalid signature",
        success: false 
      });
    }
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

/* ======================
   GET USER ORDERS
====================== */
// CHANGE: "/api/orders" -> "/api/my-orders"
app.get("/api/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ orders }); // CHANGE: Wrap in object to match frontend expectation { orders: [] }
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
/* ======================
   CHECK CURRENT USER (PERSIST LOGIN)
====================== */
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    // Find user by ID (from the token), exclude password
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error("AUTH CHECK ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================
   ADMIN MIDDLEWARE & ROUTES
====================== */

// 1. Admin Middleware
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    // Simple check: Is this the owner's email?
    // In a real app, you'd have an 'role: "admin"' field in the DB.
    if (user.email === process.env.OWNER_EMAIL) {
      next();
    } else {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get All Orders (Admin Only)
app.get("/api/admin/orders", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    // Fetch all orders, newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    
    // Calculate Stats
    const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'created').length;

    res.json({ orders, stats: { totalRevenue, totalOrders, pendingOrders } });
  } catch (err) {
    res.status(500).json({ message: "Admin Data Error" });
  }
});

// 3. Update Order Status (Admin Only)
app.put("/api/admin/order/:id", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body; // e.g., "Shipped", "Delivered"
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true }
    );
    // Optional: Trigger an email here telling the user "Your order is Shipped!"
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Update Failed" });
  }
});

/* ======================
   FORGOT PASSWORD
====================== */
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a temporary token (valid for 15 mins)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    
    // Create the Reset Link (Point to your Frontend URL)
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Diamond Fragrance Password",
      html: `
        <div style="background-color: #0C0C0C; padding: 40px; text-align: center; font-family: Arial, sans-serif;">
          <h1 style="color: #DCCA87; margin-bottom: 20px;">Password Reset Request</h1>
          <p style="color: #fff; margin-bottom: 30px;">You requested to reset your password. Click the button below to proceed.</p>
          <a href="${resetLink}" style="background-color: #DCCA87; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">RESET PASSWORD</a>
          <p style="color: #888; margin-top: 30px; font-size: 12px;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending email" });
  }
});

/* ======================
   RESET PASSWORD
====================== */
app.post("/api/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = verified.id;

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
/* ======================
   CONTACT FORM ROUTE
====================== */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("------------------------------------------------");
    console.log("1. Contact Request Received");
    console.log(`2. From: ${email}`);
    
    // DIAGNOSTIC LOGS (Check if these are undefined)
    console.log("3. Checking Variables:");
    console.log("   - EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ MISSING");
    console.log("   - EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ MISSING");
    console.log("   - OWNER_EMAIL:", process.env.OWNER_EMAIL ? "✅ Set" : "❌ MISSING");

    if (!process.env.OWNER_EMAIL) {
        throw new Error("OWNER_EMAIL is missing in .env file");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `New Inquiry from ${name}`,
      html: `<p>${message}</p>`
    });

    console.log("4. Email Sent Successfully!");
    res.json({ message: "Message sent successfully" });

  } catch (err) {
    console.error("!!! ERROR OCCURRED !!!");
    console.error(err.message); // This will tell us the exact problem
    res.status(500).json({ message: "Failed to send message" });
  }
});
/* ======================
   SERVER
====================== */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});