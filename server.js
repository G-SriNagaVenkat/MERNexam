const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use Express JSON parser

// MongoDB Connection
const uri = process.env.MONGO_URI || "mongodb+srv://sunnysri:mongodbpass@cluster0.25t9p.mongodb.net/eventsManagement";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema and Model
const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema, 'events');

// Create (POST) an event
app.post('/postevents', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Read (GET) all events
app.get('/getevents', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update (PUT) an event by ID
app.put('/putevents/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete (DELETE) an event by ID
app.delete('/deleteevents/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
