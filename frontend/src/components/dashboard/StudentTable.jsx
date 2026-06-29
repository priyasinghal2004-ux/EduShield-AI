import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getRiskClasses, getRiskDisplayLabel } from '../../utils/riskHelpers';

export default function StudentTable({ students, title = "Recent Students" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.firstName + ' ' + student.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || student.prediction.riskLabel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white w-full sm:w-auto outline-none transition-all"
            >
              <option value="all">All Risks</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="p-4 pl-6">Student</th>
              <th className="p-4">Grade</th>
              <th className="p-4">GPA</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4 pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-500">
                  No students found matching your filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const label = student.prediction?.riskLabel || 'low';
                const attRate = Math.round((student.attendance.present / student.attendance.totalDays) * 100);
                
                return (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{student.studentId} • {student.assignedClass}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">Gr {student.grade}</td>
                    <td className="p-4 text-sm font-medium text-gray-700">{student.academics.gpa.toFixed(2)}</td>
                    <td className="p-4 text-sm text-gray-600">{attRate}%</td>
                    <td className="p-4">
                      <Badge className={getRiskClasses(label)}>
                        {getRiskDisplayLabel(label)}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6">
                      <Link to={`/teacher/student/${student.studentId}`}>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {filteredStudents.length} of {students.length} students</span>
      </div>
    </div>
  );
}
