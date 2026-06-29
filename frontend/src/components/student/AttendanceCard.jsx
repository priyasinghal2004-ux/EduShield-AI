import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export default function AttendanceCard({ attendance }) {
  const { present, absent, tardy, totalDays, consecutiveAbsences } = attendance;
  const rate = Math.round((present / totalDays) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
          <p className="text-sm text-gray-500">Year to Date</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-end mb-2">
          <span className="text-4xl font-extrabold text-gray-900">{rate}%</span>
          <span className="text-sm text-gray-500 mb-1">present</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
          <div 
            className={`h-2.5 rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
            style={{ width: `${rate}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Absent</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{absent} <span className="text-sm font-normal text-gray-500">days</span></p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tardy</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{tardy} <span className="text-sm font-normal text-gray-500">days</span></p>
          </div>
        </div>

        {consecutiveAbsences >= 3 && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Student has <strong>{consecutiveAbsences} consecutive absences</strong>.</span>
          </div>
        )}
      </div>
    </div>
  );
}
