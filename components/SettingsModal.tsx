import React, { useState } from 'react';
import { TEAMS, DAY_SHIFT_SEQUENCE } from '../constants';
import { TeamName } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { X, Settings, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave }) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamName>(TeamName.JIA);
  const [referenceType, setReferenceType] = useState<'day' | 'night'>('night');
  
  const today = new Date();

  const handleSave = () => {
    // If user sets "Night Shift" for Today is Team X.
    // Logic: Night Shift Team for T corresponds to Day Shift Team for T-1.
    // Sequence: A -> B -> C -> D.
    // If Night(T) = B. Then Day(T-1) = B.
    // Day(T) is next in sequence after B (which is C).
    
    // We want to store a { date: T, teamName: DayTeamOfT }.
    
    let dayShiftTeamForToday = selectedTeam;
    
    if (referenceType === 'night') {
        // If selectedTeam is the NIGHT team for today.
        // Then the DAY team for today is the NEXT one in the sequence.
        // Sequence: Yi(0), Ding(1), Jia(2), Bing(3).
        const currentIndex = DAY_SHIFT_SEQUENCE.indexOf(selectedTeam);
        const nextIndex = (currentIndex + 1) % 4;
        dayShiftTeamForToday = DAY_SHIFT_SEQUENCE[nextIndex];
    }
    
    const data = {
        date: today.toISOString(),
        teamName: dayShiftTeamForToday
    };
    
    localStorage.setItem('shift_calendar_reference', JSON.stringify(data));
    onSave();
    onClose();
  };

  const handleReset = () => {
      localStorage.removeItem('shift_calendar_reference');
      onSave();
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            班次校准
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-sm text-gray-600">
             如果显示的班次与实际不符，请在此处进行校准。
             <br/>
             设定<strong>今天</strong> ({format(today, 'MM月dd日', { locale: zhCN })}) 的实际班次。
          </div>

          <div className="space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setReferenceType('day')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${referenceType === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                  >
                      白班 (08-20)
                  </button>
                  <button 
                    onClick={() => setReferenceType('night')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${referenceType === 'night' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                  >
                      夜班 (20-08)
                  </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                  {DAY_SHIFT_SEQUENCE.map(teamName => (
                      <button
                        key={teamName}
                        onClick={() => setSelectedTeam(teamName)}
                        className={`
                            py-3 rounded-xl border-2 font-bold transition-all
                            ${selectedTeam === teamName 
                                ? `${TEAMS[teamName].color} border-current ring-2 ring-offset-1 ring-blue-200` 
                                : 'border-gray-200 hover:border-blue-300 bg-white text-gray-600'
                            }
                        `}
                      >
                          {teamName}
                      </button>
                  ))}
              </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
                onClick={handleReset}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
                <RotateCcw size={18} className="mr-2"/> 重置
            </button>
            <button 
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                确认校准
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};