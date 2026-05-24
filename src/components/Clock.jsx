import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-primary/5 border-2 border-primary/10 rounded-2xl p-6 text-center shadow-inner">
      <span className="font-gujarati text-sm text-primary/60 block mb-2 font-bold uppercase tracking-widest">વર્તમાન સમય (Live)</span>
      <span className="font-headline font-black text-4xl text-primary tracking-widest">
        {formatTime(time)}
      </span>
    </div>
  );
};

export default Clock;
