import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Define Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String, default: "" },
  allergens: { type: String, default: "" },
});

const MenuItem = mongoose.model("menu_items", menuSchema);

// ✅ Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Insert sample data if collection is empty
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      const items = [
        {
          name: "Espresso",
          category: "Hot Drinks",
          description: "A rich, intense coffee shot with bold flavor.",
          price: 300,
          image:
            "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800",
          allergens: "",
        },
        {
          name: "Cappuccino",
          category: "Hot Drinks",
          description: "Espresso with steamed milk and thick foam.",
          price: 550,
          image:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
          allergens: "Contains dairy",
        },
        {
          name: "Latte",
          category: "Hot Drinks",
          description: "Smooth and creamy coffee with milk.",
          price: 600,
          image:
            "https://images.unsplash.com/photo-1523942839745-7848d4a8e8fb?w=800",
          allergens: "Contains dairy",
        },
        {
          name: "Iced Coffee",
          category: "Cold Drinks",
          description: "Chilled coffee served over ice cubes.",
          price: 500,
          image:
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
          allergens: "",
        },
        {
          name: "Muffin",
          category: "Pastries",
          description: "Freshly baked muffin with soft texture.",
          price: 250,
          image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
          allergens: "Contains gluten, eggs",
        },
        {
          name: "Croissant",
          category: "Pastries",
          description: "Golden, buttery croissant baked to perfection.",
          price: 400,
          inStock: false,
          image:
            "https://images.unsplash.com/photo-1541592106381-f3e06cc4a9d7?w=800",
          allergens: "Contains gluten, dairy",
        },
      ];
      await MenuItem.insertMany(items);
      console.log("✅ Sample menu data inserted");
    }

    // ✅ Root route
    app.get("/", (req, res) => res.send("☕ Coffee Shop API is running!"));

    // ✅ Get all menu items
    app.get("/menu", async (req, res) => {
      try {
        const menu = await MenuItem.find();
        res.json(menu);
      } catch (err) {
        console.error("❌ Error fetching menu:", err);
        res.status(500).json({ error: "Failed to fetch menu items" });
      }
    });

    // ✅ Get one random in-stock item
    app.get("/menu/surprise", async (req, res) => {
      try {
        const inStockItems = await MenuItem.find({ inStock: true });
        if (inStockItems.length === 0) {
          return res.status(404).json({ error: "No items in stock" });
        }
        const randomItem =
          inStockItems[Math.floor(Math.random() * inStockItems.length)];
        res.json(randomItem);
      } catch (err) {
        console.error("❌ Error fetching surprise item:", err);
        res.status(500).json({ error: "Failed to fetch surprise item" });
      }
    });

    // ✅ Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Coffee Shop API running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

// Start server
startServer();
