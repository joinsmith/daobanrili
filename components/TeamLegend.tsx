import React from 'react';
import { TEAMS } from '../constants';
import { User, TrainFront, ArrowLeftRight } from 'lucide-react';
import { TeamInfo } from '../types';

export const TeamLegend: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        班组人员公示
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(TEAMS).map((team: TeamInfo) => (
          <div 
            key={team.name} 
            className={`p-4 rounded-xl border ${team.color} bg-opacity-30`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold">{team.name}班</span>
              <div className={`w-3 h-3 rounded-full ${team.color.replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[0].replace('100', '500')}`}></div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="opacity-70 flex items-center gap-1">
                  <TrainFront size={14} /> 值班站长
                </span>
                <span className="font-semibold">{team.stationMaster}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/5 pt-2">
                <span className="opacity-70 flex items-center gap-1">
                  <ArrowLeftRight size={14} /> 调车指导
                </span>
                <span className="font-semibold">{team.shuntingInstructor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
