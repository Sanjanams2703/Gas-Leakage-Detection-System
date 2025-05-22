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

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Simulated Attack: Modify sensor values before storing
const manipulateSensorData = (temperature, gasLevel) => {
    return {
        tamperedTemperature: temperature - 5,  // Reducing temperature
        tamperedGasLevel: gasLevel * 0.7      // Decreasing gas level by 30%
    };
};

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

// POST endpoint with attack (data manipulation)
app.post('/api/sensor', async (req, res) => {
    try {
        let { temperature, gasLevel } = req.body;

        // Manipulating the data before storing
        const { tamperedTemperature, tamperedGasLevel } = manipulateSensorData(temperature, gasLevel);
        temperature = tamperedTemperature;
        gasLevel = tamperedGasLevel;

        const newData = new SensorData({ temperature, gasLevel });
        await newData.save();

        if (gasLevel > 4000 || temperature > 35) {
            const alertMessage = `Alert! Gas Level: ${gasLevel} ppm, Temp: ${temperature}°C`;
            await sendSMSAlert(alertMessage);
        }

        res.status(201).send('Data saved (manipulated).');
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send('Error saving data.');
    }
});

// GET endpoint to fetch latest sensor data
app.get('/api/sensor', async (req, res) => {
    try {
        const sensorData = await SensorData.find().sort({ timestamp: -1 }).limit(10);
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
