import React from 'react';

const AlertNotification = ({ message }) => {
  return message ? <div className='alert'>{message}</div> : null;
};

export default AlertNotification;