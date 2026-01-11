const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./MiddleWare/authMiddleware');
const Hisaab = require("./model/hisaab.model")
const Room = require("./model/room.model")
const cors = require("cors");

require('dotenv').config();


const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

//these are the routes for the application



//these are for the main usage
app.get("/api/hisaabs", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const sortBy = req.query.sort || "date_desc";

    let sortQuery = { createdAt: -1 };

    if (sortBy === "date_asc") sortQuery = { createdAt: 1 };
    else if (sortBy === "title_asc") sortQuery = { title: 1 };
    else if (sortBy === "title_desc") sortQuery = { title: -1 };

    const hisaabs = await Hisaab.find({ createdBy: userId }).sort(sortQuery);

    res.json({
      sortBy,
      hisaabs,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load hisaabs" });
  }
});


app.get("/api/hisaabs/search", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { search = "", date = "", sort = "date_desc" } = req.query;

    let query = { createdBy: userId };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (date) {
      const selected = new Date(date);
      const nextDay = new Date(selected);
      nextDay.setDate(selected.getDate() + 1);
      query.date = { $gte: selected, $lt: nextDay };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === "date_asc") sortQuery = { createdAt: 1 };
    else if (sort === "title_asc") sortQuery = { title: 1 };
    else if (sort === "title_desc") sortQuery = { title: -1 };

    const hisaabs = await Hisaab.find(query).sort(sortQuery);

    res.json({
      hisaabs,
      search,
      date,
      sort,
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});








//and these are the routes for the login and register pages mainly for authentication
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});



//routes for hisaab crud
// CREATE
app.post("/api/hisaabs", authMiddleware, async (req, res) => {
  const { title, label, content, encrypted, password } = req.body;

  const hisaab = new Hisaab({
    title,
    label,
    content,
    encrypted,
    createdBy: req.user._id,
  });

  if (encrypted) {
    hisaab.password = await bcrypt.hash(password, 10);
  }

  await hisaab.save();
  res.status(201).json(hisaab);
});




// GET SINGLE
app.get("/api/hisaabs/:id", authMiddleware, async (req, res) => {
  const hisaab = await Hisaab.findById(req.params.id);
  res.json(hisaab);
});


//update
app.put("/api/hisaabs/:id", authMiddleware, async (req, res) => {
  const { title, label, content, encrypted, password } = req.body;

  const update = { title, label, content, encrypted };
  if (encrypted && password) {
    update.password = await bcrypt.hash(password, 10);
  }

  const updated = await Hisaab.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });

  res.json(updated);
});

// DELETE route to remove a Hisaab
app.delete("/api/hisaabs/:id", authMiddleware, async (req, res) => {
  await Hisaab.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  res.json({ message: "Hisaab deleted" });
});

// UNLOCK
app.post("/api/hisaabs/:id/unlock", authMiddleware, async (req, res) => {
  const hisaab = await Hisaab.findById(req.params.id);
  const isMatch = await bcrypt.compare(req.body.password, hisaab.password);

  if (!isMatch) return res.status(403).json({ message: "Access denied" });
  res.json(hisaab);
});

//dashboard routes
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  const userId = req.user._id;

  const expensesByCategory = await Hisaab.aggregate([
    { $match: { createdBy: userId, encrypted: false } },
    {
      $project: {
        label: 1,
        totalValue: {
          $sum: {
            $map: {
              input: "$content",
              as: "item",
              in: { $toDouble: "$$item.value" },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$label",
        totalAmount: { $sum: "$totalValue" },
      },
    },
  ]);

  const hisaabTotals = await Hisaab.aggregate([
    { $match: { createdBy: userId, encrypted: false } },
    {
      $project: {
        title: 1,
        totalValue: {
          $sum: {
            $map: {
              input: "$content",
              as: "item",
              in: { $toDouble: "$$item.value" },
            },
          },
        },
      },
    },
  ]);

  res.json({ expensesByCategory, hisaabTotals });
});

//room routes would go here

app.get("/api/rooms", authMiddleware, async (req, res) => {
  const userId = req.user._id;

  const allRooms = await Room.find({});
  const myRooms = await Room.find({ members: userId });

  res.json({ allRooms, myRooms });
});

app.post("/api/rooms", authMiddleware, async (req, res) => {
  const { name, description, password } = req.body;

  const room = await Room.create({
    name,
    description,
    password: await bcrypt.hash(password, 10),
    members: [req.user._id],
  });

  res.status(201).json(room);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
