import React from 'react';
import { BookOpen } from 'lucide-react';

export default function GradesCard({ academics }) {
  const { gpa, failedCourses, currentGrades } = academics;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Academics</h3>
          <p className="text-sm text-gray-500">Current Semester</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Cumulative GPA</p>
            <p className={`text-4xl font-extrabold ${gpa < 2.0 ? 'text-red-600' : 'text-gray-900'}`}>
              {gpa.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Failed Courses</p>
             <p className={`text-3xl font-bold ${failedCourses > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {failedCourses}
             </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Current Grades</p>
          <div className="space-y-2">
            {currentGrades.map((g, idx) => {
              const isFailing = g.grade === 'F' || g.grade === 'D';
              return (
                <div key={idx} className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{g.course}</span>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${isFailing ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {g.grade}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
