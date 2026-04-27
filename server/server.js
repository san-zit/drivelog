const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// app.use(cors());


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const TripSchema = new mongoose.Schema({
  date: String,
  startKm: Number,
  endKm: Number,
  from: String,
  to: String,
});

const Trip = mongoose.model("Trip", TripSchema);

app.get("/trips", async (req, res) => {
  const data = await Trip.find();
  res.json(data);
});
app.post("/trips", async (req, res) => {
  const trip = new Trip(req.body);
  await trip.save();
  res.json(trip);
});
app.put("/trips/:id", async (req, res) => {
  try {
    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/trips/:id", async (req, res) => {
  console.log("DELETE ID:", req.params.id);

  try {
    const deleted = await Trip.findByIdAndDelete(req.params.id);

    console.log("Deleted result:", deleted);

    if (!deleted) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully", deleted });
  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5050;

    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connectipon error noooooooo!", err);

    process.exit(1);
  });
