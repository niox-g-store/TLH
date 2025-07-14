import React, { useEffect, useState } from 'react';
import './style.css';

const CountdownTimer = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = Math.max(end - now, 0);

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <div className='dates'>
        <div>{days}</div>
        <div>Days</div>
      </div>
      <div className='dates'>
        <div>{hours}</div>
        <div>Hours</div>
      </div>
      <div className='dates'>
        <div>{minutes}</div>
        <div>Minutes</div>
      </div>
      <div className='dates'>
        <div>{seconds}</div>
        <div>Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
