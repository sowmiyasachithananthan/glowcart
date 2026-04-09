const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "GlowCart backend is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@glowcart.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "glowcart-admin-secret";
const JWT_SECRET = process.env.JWT_SECRET || "glowcart-jwt-secret";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String, default: "newsletter" },
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const Subscriber = mongoose.model("Subscriber", subscriberSchema);
const ContactSubmission = mongoose.model("ContactSubmission", contactSchema);
const User = mongoose.model("User", userSchema);

function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_SECRET) {
    return res.status(401).json({ message: "Unauthorized admin access" });
  }
  next();
}

function userAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Missing token" });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ adminKey: ADMIN_SECRET });
  }
  return res.status(401).json({ message: "Invalid admin credentials" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, password required" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/auth/me", userAuth, async (req, res) => {
  const user = await User.findById(req.user.userId).select("_id name email createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.get("/api/products", async (req, res) => {
  const { category } = req.query;
  if (!category) {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  }
  const normalize = (value) => String(value || "").toLowerCase().replace(/[\s-]/g, "");
  const wanted = normalize(category);
  const allProducts = await Product.find().sort({ createdAt: -1 });
  const filtered = allProducts.filter((p) => {
    const current = normalize(p.category);
    return current === wanted || current.includes(wanted) || wanted.includes(current);
  });
  res.json(filtered);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/api/products", adminAuth, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.put("/api/products/:id", adminAuth, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
});

app.delete("/api/products/:id", adminAuth, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

app.post("/api/orders", async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

app.get("/api/my-orders", userAuth, async (req, res) => {
  const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
  res.json(orders);
});

app.post("/api/subscribers", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const existing = await Subscriber.findOne({ email });
  if (existing) return res.json(existing);
  const subscriber = await Subscriber.create({ email, source: "newsletter" });
  res.status(201).json(subscriber);
});

app.post("/api/contact-submissions", async (req, res) => {
  const submission = await ContactSubmission.create(req.body);
  res.status(201).json(submission);
});

app.get("/api/orders", adminAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.get("/api/subscribers", adminAuth, async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subscribers);
});

app.get("/api/contact-submissions", adminAuth, async (req, res) => {
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
  res.json(submissions);
});

app.patch("/api/orders/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));