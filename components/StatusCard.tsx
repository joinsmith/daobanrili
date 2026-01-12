import React, { useEffect, useState } from 'react';
import { getCurrentStatus } from '../utils/logic';
import { CurrentStatus, RoleType } from '../types';
import { TrainFront, ArrowLeftRight, User, Briefcase } from 'lucide-react';

export const StatusCard: React.FC = () => {
  const [status, setStatus] = useState<CurrentStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getCurrentStatus(new Date()));
    update();
    // Update every minute to check for shift changes
    const timer = setInterval(update, 60000); 
    return () => clearInterval(timer);
  }, []);

  if (!status) return null;

  const ShiftRow = ({ 
    title, 
    data, 
    icon: Icon 
  }: { 
    title: string; 
    data: CurrentStatus['ops'] | CurrentStatus['shunting']; 
    icon: any 
  }) => (
    <div className={`relative overflow-hidden rounded-xl border p-4 ${data.team.color} shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white bg-opacity-50 rounded-lg">
            <Icon size={20} className="text-gray-700" />
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="px-3 py-1 bg-white bg-opacity-60 rounded-full text-sm font-semibold shadow-sm">
          {data.shift}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-80 flex items-center gap-1">
             <Briefcase size={14}/> 当前班组
          </span>
          <span className="text-2xl font-bold">{data.team.name}班</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-black/10">
          <span className="text-sm opacity-80 flex items-center gap-1">
            <User size={14} /> {data.personnelLabel}
          </span>
          <span className="text-lg font-medium">{data.personnelName}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full max-w-4xl mx-auto mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShiftRow 
          title={RoleType.OPS} 
          data={status.ops} 
          icon={TrainFront} 
        />
        <ShiftRow 
          title={RoleType.SHUNTING} 
          data={status.shunting} 
          icon={ArrowLeftRight} 
        />
      </div>
    </div>
  );
};