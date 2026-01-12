import React from 'react';
import { StatusCard } from './components/StatusCard';
import { CalendarView } from './components/CalendarView';
import { Train } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-wide">铁路智能倒班系统</span>
            </div>
            
            <div className="text-sm text-slate-400 hidden sm:block">
               行车 & 调车 综合排班
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Section: Real-time Status */}
        <StatusCard />

        {/* Divider */}
        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-sm font-medium text-gray-500">
                    排班日历 (点击查看详情)
                </span>
            </div>
        </div>

        {/* Bottom Section: Calendar */}
        <CalendarView />

        {/* Info Footer */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-sm text-gray-600 space-y-2">
          <h3 className="font-bold text-gray-900 mb-2">排班规则说明</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold block text-blue-700">行车岗位 (Ops)</span>
              <ul className="list-disc list-inside mt-1 space-y-1 opacity-80">
                <li>白班：08:00 - 20:00</li>
                <li>前夜：20:00 - 次日02:30</li>
                <li>后夜：次日02:30 - 08:00</li>
                <li>周期：白班 → (20点休息) → 次日后夜+前夜 → 休息 → 休息</li>
              </ul>
            </div>
            <div>
              <span className="font-semibold block text-blue-700">调车岗位 (Shunting)</span>
              <ul className="list-disc list-inside mt-1 space-y-1 opacity-80">
                <li>白班：08:00 - 20:00</li>
                <li>夜班：20:00 - 次日08:00</li>
                <li>周期：白班 → (休息) → 次日夜班 → 休息 → 休息</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;