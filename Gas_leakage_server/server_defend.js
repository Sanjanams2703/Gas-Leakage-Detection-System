require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const USER_PHONE = process.env.USER_PHONE_NUMBER;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define Schema
const SensorSchema = new mongoose.Schema({
    temperature: Number,
    gasLevel: Number,
    timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', SensorSchema);

// Store original data for comparison
const OriginalSensorSchema = new mongoose.Schema({
    temperature: Number,
    gasLevel: Number,
    timestamp: { type: Date, default: Date.now }
});

const OriginalSensorData = mongoose.model('OriginalSensorData', OriginalSensorSchema);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Function to send alerts
const sendSMSAlert = async (message) => {
    try {
        await client.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: USER_PHONE,
        });
        console.log("Alert sent successfully!");
    } catch (error) {
        console.error("Error sending alert:", error);
    }
};

// POST endpoint with defense (stores both original and manipulated data)
app.post('/api/sensor', async (req, res) => {
    try {
        let { temperature, gasLevel } = req.body;

        // Store original sensor data before any manipulation
        const originalData = new OriginalSensorData({ temperature, gasLevel });
        await originalData.save();

        // Simulated attack: Manipulated data
        let tamperedTemperature = temperature - 5;
        let tamperedGasLevel = gasLevel * 0.7;

        // Defense: Compare original and manipulated values
        if (Math.abs(tamperedTemperature - temperature) > 3 || Math.abs(tamperedGasLevel - gasLevel) > 500) {
            console.warn("⚠️ Potential Data Manipulation Detected!");
            return res.status(400).json({ message: "Sensor data manipulation detected!" });
        }

        // Store valid data in the database
        const newData = new SensorData({ temperature, gasLevel });
        await newData.save();

        if (gasLevel > 4000 || temperature > 35) {
            const alertMessage = `Alert! Gas Level: ${gasLevel} ppm, Temp: ${temperature}°C`;
            await sendSMSAlert(alertMessage);
        }

        res.status(201).send('Data saved with security check.');
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send('Error saving data.');
    }
});

// GET endpoint to detect possible attacks
app.get('/api/sensor/detect', async (req, res) => {
    try {
        const lastOriginal = await OriginalSensorData.findOne().sort({ timestamp: -1 });
        const lastManipulated = await SensorData.findOne().sort({ timestamp: -1 });

        if (!lastOriginal || !lastManipulated) {
            return res.json({ message: "No sufficient data for attack detection." });
        }

        // Compare original and manipulated values
        const tempDiff = Math.abs(lastOriginal.temperature - lastManipulated.temperature);
        const gasDiff = Math.abs(lastOriginal.gasLevel - lastManipulated.gasLevel);

        if (tempDiff > 3 || gasDiff > 500) {
            return res.json({ alert: "⚠️ Possible Data Tampering Detected!" });
        }

        res.json({ message: "No attack detected." });
    } catch (error) {
        console.error("Error detecting attack:", error);
        res.status(500).json({ message: "Error in detection." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
