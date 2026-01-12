import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 tabular-nums">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-gray-500 mt-1 text-sm md:text-base">
        {format(time, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
      </div>
    </div>
  );
};