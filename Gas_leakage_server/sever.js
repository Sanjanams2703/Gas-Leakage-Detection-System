require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const twilio = require('twilio');

// Twilio Credentials (Loaded from .env)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const USER_PHONE = process.env.USER_PHONE_NUMBER;

// MongoDB Connection
const uri = process.env.MONGO_URI;  // Store the MongoDB URI in .env file
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define Schema
const SensorSchema = new mongoose.Schema({
    temperature: Number,
    gasLevel: Number,
    timestamp: { type: Date, default: Date.now }
});

// Create Model
const SensorData = mongoose.model('SensorData', SensorSchema);

// Express Setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Function to Send Alerts via SMS
const sendSMSAlert = async (message) => {
    try {
        await client.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: USER_PHONE,  // Recipient's phone number
        });
        console.log("Alert sent successfully!");
    } catch (error) {
        console.error("Error sending alert:", error);
    }
};

// POST endpoint to receive data from ESP32
app.post('/api/sensor', async (req, res) => {
    try {
        const { temperature, gasLevel } = req.body;
        const newData = new SensorData({ temperature, gasLevel });
        await newData.save();

        // Check for High Gas Level or Temperature
        if (gasLevel > 4000 || temperature > 35) {
            const alertMessage = `Alert! High Gas Level: ${gasLevel} ppm or Temperature: ${temperature}°C detected! Take action immediately.`;
            await sendSMSAlert(alertMessage);
        }

        res.status(201).send('Data saved and alert checked.');
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send('Error saving data or sending alert');
    }
});

// GET endpoint to retrieve latest sensor data
app.get('/api/sensor', async (req, res) => {
    try {
        const sensorData = await SensorData.find().sort({ timestamp: -1 }).limit(10); // Fetch latest 10 records
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// GET endpoint to retrieve highest gas level and temperature
app.get('/api/sensor/highest', async (req, res) => {
    try {
        const highestValues = await SensorData.aggregate([
            {
                $group: {
                    _id: null,
                    maxGas: { $max: "$gasLevel" },
                    maxTemp: { $max: "$temperature" }
                }
            }
        ]);

        const highestGas = highestValues[0]?.maxGas || 0;
        const highestTemp = highestValues[0]?.maxTemp || 0;

        res.json({ gasLevel: highestGas, temperature: highestTemp });
    } catch (error) {
        console.error('Error fetching highest sensor values:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Scheduled Cleanup Task (Deletes data older than 1 month)
cron.schedule('0 0 * * *', async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
        const result = await SensorData.deleteMany({ timestamp: { $lt: oneMonthAgo } });
        console.log(`Deleted ${result.deletedCount} old records from the database.`);
    } catch (error) {
        console.error("Error deleting old records:", error);
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
