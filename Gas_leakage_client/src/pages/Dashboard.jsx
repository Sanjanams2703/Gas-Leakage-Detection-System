import React, { useEffect, useState } from 'react';
import SensorChart from '../components/SensorChart';
import SensorDataCard from '../components/SensorDataCard';
import AlertNotification from '../components/AlertNotification';
import config from '../../../Gas_leakage_client/config';

const API_URL = `${config.SERVER_URL}/api/sensor`;
const HIGHEST_API_URL = `${config.SERVER_URL}/api/sensor/highest`; // New API for highest values

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [highestGasLevel, setHighestGasLevel] = useState(null);
  const [highestTemperature, setHighestTemperature] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        setSensorData(data.slice(-5)); // Only store the latest 5 readings

        // Trigger alert if the latest gas level is too high
        const latest = data[data.length - 1];
        if (latest?.gasLevel > 4000) {
          setAlert('⚠️ High gas concentration detected!');
        } else {
          setAlert(null);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    const fetchHighestValues = async () => {
      try {
        const response = await fetch(HIGHEST_API_URL);
        const highestData = await response.json();
        console.log("Highest API Response:", highestData); // Debugging
        setHighestGasLevel(highestData.gasLevel);
        setHighestTemperature(highestData.temperature);
      } catch (error) {
        console.error('Error fetching highest values:', error);
      }
    };

    fetchSensorData();
    fetchHighestValues();
    
    const interval = setInterval(() => {
      fetchSensorData();
      fetchHighestValues();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {alert && <AlertNotification message={alert} />}

      {/* Highest Values Cards */}
      <div className="highest-values-container">
        <SensorDataCard temperature={highestTemperature} gasLevel={highestGasLevel} isHighest={true} />
      </div>

      {/* Recent 5 Readings Cards */}
      <div className="cards-container">
        {sensorData.map((data, index) => (
          <SensorDataCard key={index} temperature={data.temperature} gasLevel={data.gasLevel} />
        ))}
      </div>

      {/* Graphs Section - No Changes */}
      <div className="charts-container">
        <div className="chart-box">
          <h3>Temperature Trends</h3>
          <SensorChart data={sensorData} parameter="temperature" color="#ff5733" />
        </div>
        <div className="chart-box">
          <h3>Gas Level Trends</h3>
          <SensorChart data={sensorData} parameter="gasLevel" color="#17a2b8" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
