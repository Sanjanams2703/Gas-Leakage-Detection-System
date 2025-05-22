import React from 'react';

const SensorDataCard = ({ temperature = "N/A", gasLevel = "N/A", isHighest }) => {
  return (
    <div className={`sensor-card ${isHighest ? 'highlight-card' : ''}`}>
      <h3>{isHighest ? 'Highest Recorded Values' : 'Sensor Data'}</h3>
      <p>Temperature: {temperature !== null ? `${temperature}°C` : "N/A"}</p>
      <p>Gas Level: {gasLevel !== null ? `${gasLevel} ppm` : "N/A"}</p>
    </div>
  );
};

export default SensorDataCard;
