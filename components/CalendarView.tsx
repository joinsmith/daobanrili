import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sun, Moon, X, Clock } from 'lucide-react';
import { getDayInfo, getNightStartTeam } from '../utils/logic';
import { DayInfo, TeamInfo } from '../types';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  // Modal Content
  const DayDetailModal = ({ date, onClose }: { date: Date; onClose: () => void }) => {
    const dayInfo = getDayInfo(date);
    // For a specific calendar day:
    // Morning (02:30-08:00) is covered by the team that started Night Shift yesterday.
    // However, our getNightStartTeam(date) returns the team starting Night Shift TODAY (20:00).
    // The team working the Early Morning (Late Night) shift on DATE is the same team working Early Night on DATE.
    // Logic check:
    // Nov 11: Bing works Early Night (20:00).
    // Nov 11: Bing works Late Night (02:30-08:00).
    // So getNightStartTeam(date) returns the team for BOTH night segments of this calendar day.
    const nightTeam = dayInfo.nightShiftTeam;
    const dayTeam = dayInfo.dayShiftTeam;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <h3 className="font-bold text-lg text-gray-800">
              {format(date, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Ops Schedule */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                 行车岗位 (Station Master)
              </h4>
              <div className="space-y-3">
                <div className={`flex items-center p-3 rounded-lg border ${nightTeam.color} bg-opacity-30`}>
                  <div className="w-24 text-xs font-mono opacity-70">02:30 - 08:00</div>
                  <div className="flex-1 font-bold flex justify-between items-center">
                    <span>{nightTeam.name}班 (后夜)</span>
                    <span className="text-sm font-normal">{nightTeam.stationMaster}</span>
                  </div>
                </div>
                <div className={`flex items-center p-3 rounded-lg border ${dayTeam.color} bg-opacity-30`}>
                  <div className="w-24 text-xs font-mono opacity-70">08:00 - 20:00</div>
                  <div className="flex-1 font-bold flex justify-between items-center">
                    <span>{dayTeam.name}班 (白班)</span>
                    <span className="text-sm font-normal">{dayTeam.stationMaster}</span>
                  </div>
                </div>
                <div className={`flex items-center p-3 rounded-lg border ${nightTeam.color} bg-opacity-30`}>
                  <div className="w-24 text-xs font-mono opacity-70">20:00 - 02:30</div>
                  <div className="flex-1 font-bold flex justify-between items-center">
                     <span>{nightTeam.name}班 (前夜)</span>
                     <span className="text-sm font-normal">{nightTeam.stationMaster}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shunting Schedule */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                 调车岗位 (Instructor)
              </h4>
              <div className="space-y-3">
                <div className={`flex items-center p-3 rounded-lg border ${dayTeam.color} bg-opacity-30`}>
                  <div className="w-24 text-xs font-mono opacity-70">08:00 - 20:00</div>
                  <div className="flex-1 font-bold flex justify-between items-center">
                     <span>{dayTeam.name}班 (白班)</span>
                     <span className="text-sm font-normal">{dayTeam.shuntingInstructor}</span>
                  </div>
                </div>
                <div className={`flex items-center p-3 rounded-lg border ${nightTeam.color} bg-opacity-30`}>
                  <div className="w-24 text-xs font-mono opacity-70">20:00 - 08:00</div>
                  <div className="flex-1 font-bold flex justify-between items-center">
                     <span>{nightTeam.name}班 (夜班)</span>
                     <span className="text-sm font-normal">{nightTeam.shuntingInstructor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-gray-700">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">
            {format(currentDate, 'yyyy年 MM月', { locale: zhCN })}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={goToday}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
                今天
            </button>
          <div className="flex bg-gray-100 rounded-md p-0.5">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {calendarDays.map((day) => {
          const info: DayInfo = getDayInfo(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);
          
          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDay(day)}
              className={`
                min-h-[80px] md:min-h-[100px] p-2 rounded-lg border transition-all duration-200 cursor-pointer
                flex flex-col justify-between group
                ${isCurrentMonth ? 'bg-white hover:border-blue-300 hover:shadow-md' : 'bg-gray-50'}
                ${isDayToday ? 'ring-2 ring-blue-500 border-transparent z-10' : 'border-gray-100'}
                ${!isCurrentMonth && 'opacity-50'}
              `}
            >
              {/* Date Number */}
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                  ${isDayToday ? 'bg-blue-600 text-white' : 'text-gray-700 group-hover:bg-gray-100'}
                `}>
                  {format(day, 'd')}
                </span>
              </div>

              {/* Shift Indicators */}
              <div className="space-y-1 mt-1">
                {/* Day Shift (8-20) */}
                <div className={`
                   text-xs px-1.5 py-0.5 rounded flex items-center justify-between
                   ${info.dayShiftTeam.color}
                `}>
                  <div className="flex items-center gap-1">
                     <Sun size={10} />
                     <span className="font-bold">{info.dayShiftTeam.name}</span>
                  </div>
                  <span className="scale-75 origin-right opacity-80">白</span>
                </div>

                {/* Night Shift Start (20-8/2:30) */}
                <div className={`
                   text-xs px-1.5 py-0.5 rounded flex items-center justify-between bg-opacity-80
                   ${info.nightShiftTeam.color.replace('bg-', 'bg-opacity-40 bg-')}
                `}>
                  <div className="flex items-center gap-1">
                     <Moon size={10} />
                     <span className="font-bold">{info.nightShiftTeam.name}</span>
                  </div>
                  <span className="scale-75 origin-right opacity-80">夜</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500 border-t pt-4">
          <div className="flex items-center gap-1">
            <Sun size={12} className="text-orange-500"/> <span>白班 (08:00 - 20:00)</span>
          </div>
          <div className="flex items-center gap-1">
            <Moon size={12} className="text-indigo-500"/> <span>夜班/前夜 (20:00 开始)</span>
          </div>
          <div className="ml-auto text-gray-400">
             点击日期查看详细排班
          </div>
      </div>

      {selectedDay && <DayDetailModal date={selectedDay} onClose={() => setSelectedDay(null)} />}
    </div>
  );
};