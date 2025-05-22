# Secure Gas Leakage Detection System

## Project Overview

The **Secure Gas Leakage Detection System** is a real-time, intelligent, and secure platform for detecting harmful gas leaks using **IoT**, **Machine Learning**, and **Cybersecurity**. Designed for use in industrial and residential environments, this system continuously monitors gas concentrations and temperature using embedded sensors and sends immediate alerts to users when a leak is detected.

The project also integrates advanced security techniques to detect and defend against cyberattacks that may tamper with sensor data. With an intuitive frontend dashboard, real-time data visualization, and robust backend architecture, the system provides an end-to-end safety solution.

---

## Objectives

* Detect gas leaks and abnormal temperature rises in real time.
* Alert users through SMS, WhatsApp, and phone calls using Twilio API.
* Use ML-based anomaly detection for precise leak predictions.
* Implement security mechanisms to detect and defend against sensor data tampering.
* Provide an interactive dashboard for monitoring live and historical sensor data.

---

## System Architecture

The system consists of four main components:

### 1. **Hardware Layer**

* **MQ4 Gas Sensor**: Detects harmful gases like methane, carbon monoxide, and LPG.
* **DHT11 Temperature Sensor**: Monitors the ambient temperature.
* **ESP32 Microcontroller**: Reads sensor data and sends it to the server via Wi-Fi using MQTT or HTTP protocols.
* Triggers an internal buzzer when dangerous levels are detected.

### 2. **Backend Server**

* Built using **Node.js and Express.js**.
* Stores sensor data in **MongoDB**.
* Sends real-time alerts through **Twilio API** if thresholds are breached.
* Implements security layers for identifying tampered data using anomaly detection.

### 3. **Machine Learning Engine**

* Models used: **Random Forest**, **Logistic Regression**, and **XGBoost**.
* Combined using a **Stacking Classifier** to improve prediction accuracy.
* Detects anomalies in sensor data during both normal operations and cyberattacks.
* Achieved **96.93% accuracy**, significantly outperforming traditional models.

### 4. **Frontend Dashboard**

* Built with **React.js**.
* Displays live sensor readings and historical data.
* Charts and tables show trends in gas concentration and temperature.
* Visual alerts are shown during gas leakage events.

---

## Security Features

The system incorporates both **attack simulation** and **defense mechanisms**:

### Attack Server

* Intercepts and manipulates sensor data to simulate false positives/negatives.
* Helps test the robustness of the system against cyber threats.

### Defense Server

* Uses statistical and ML-based anomaly detection.
* Flags abnormal readings and blocks malicious data.
* Notifies the admin if an attack is detected.

---

## Performance Results

### Model Metrics

| Metric    | Ensemble Model | 
| --------- | -------------- | 
| Accuracy  | 96.93%         | 
| Precision | 0.97           | 
| Recall    | 0.97           |
| F1-Score  | 0.97           |

* The **confusion matrix** shows high classification performance across four classes.
* **AUC-ROC Score**: Near-perfect (1.00), indicating excellent leak detection capabilities.

---

## Dashboard Features

* Developed using **React.js** for responsiveness and clarity.
* Displays:

  * Live sensor values (gas & temperature).
  * Historical sensor data.
  * Maximum readings recorded.
  * Graphical data representations (charts and tables).
* Issues real-time warnings on dashboard during gas leak events.

---

## System Workflow

### Step-by-Step Data Flow:

1. **ESP32** reads gas and temperature values.
2. Sends data to the backend via **MQTT/HTTP**.
3. **Backend** stores data in **MongoDB** and checks for threshold violations.
4. If danger is detected:

   * Sends **SMS**, **WhatsApp**, and **phone call** alerts via **Twilio API**.
   * Displays a warning on the **frontend dashboard**.
5. **ML model** classifies the reading as safe or dangerous.
6. **Attack server** may simulate data tampering.
7. **Defense server** validates data and blocks anomalies.

---

## Tools & Technologies

| Category        | Technology                     |
| --------------- | ------------------------------ |
| Microcontroller | ESP32                          |
| Sensors         | MQ4 (Gas), DHT11 (Temperature) |
| Backend         | Node.js, Express.js            |
| Database        | MongoDB                        |
| Frontend        | React.js                       |
| ML Models       | Random Forest, XGBoost, LR     |
| Alerting System | Twilio API                     |
| Protocols       | MQTT / HTTP                    |

---

##  Getting Started

### Hardware Setup

1. Connect **MQ4** and **DHT11** sensors to the **ESP32**.
2. Power the ESP32 using a **12V DC Adapter**.
3. Upload Arduino code to read sensor values and transmit them via Wi-Fi.

---

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend/
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the backend server:

   ```
   node server.js
   ```

4. Ensure **MongoDB** is running locally or hosted in the cloud.

5. Add your Twilio credentials in a `.env` file

---

### ML Model Training

1. Collect sensor data for training.
2. Train base models (**Random Forest**, **XGBoost**, **Logistic Regression**).
3. Use `StackingClassifier` from `sklearn` to combine them.
4. Save the trained ensemble model for use in real-time prediction.

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend/
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Start the frontend app:

   ```
   npm start
   ```
4. Make sure the frontend is pointing to the correct backend endpoint (API URL).

---

### Update .env file with your credentials

1. Twilio_SID.
2. Twilio Auth_Token.
3. Twilio number.
4. Your phone number.
5. Update your cluster MongoURI.

## Alert Mechanism

When gas concentration or temperature exceeds the predefined threshold:

* Alerts are sent via:

  * **SMS**

* Notifications are powered by the **Twilio API**.

* The frontend dashboard also shows real-time visual warnings.

---
