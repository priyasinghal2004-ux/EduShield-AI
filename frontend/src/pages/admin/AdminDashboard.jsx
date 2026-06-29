import React, { useState, useEffect } from 'react';
import RiskSummaryCard from '../../components/dashboard/RiskSummaryCard';
import RiskDistributionChart from '../../components/dashboard/RiskDistributionChart';
import StudentTable from '../../components/dashboard/StudentTable';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get('/students');
        const studentsData = res.data.data;
        
        // Fetch predictions for all students (batch)
const studentIds = studentsData.map(s => s.studentId);

console.log("Student IDs:", studentIds);

if (studentIds.length > 0) {
  try {
    await axiosInstance.post('/predictions/batch', { studentIds });
  } catch (e) {
    console.warn("Batch prediction failed:", e.message);
  }
}
        
        // Fetch latest prediction for each student
        const enrichedStudents = await Promise.all(studentsData.map(async (student) => {
          try {
            const predRes = await axiosInstance.get(`/predictions/${student.studentId}/latest`);
            student.prediction = predRes.data.data || { riskScore: 0, riskLabel: 'low' };
          } catch (e) {
            student.prediction = { riskScore: 0, riskLabel: 'low' };
          }
          return student;
        }));

        const critical = enrichedStudents.filter(s => s.prediction.riskLabel === 'critical').length;
        const high = enrichedStudents.filter(s => s.prediction.riskLabel === 'high').length;
        const medium = enrichedStudents.filter(s => s.prediction.riskLabel === 'medium').length;
        const low = enrichedStudents.filter(s => s.prediction.riskLabel === 'low').length;

        setStats({ total: enrichedStudents.length, critical, high, medium, low });
        
        // Sort students by risk score (highest first)
        enrichedStudents.sort((a, b) => b.prediction.riskScore - a.prediction.riskScore);
        setStudents(enrichedStudents);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of school-wide student retention risk.</p>
      </div>
      
      <RiskSummaryCard stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskDistributionChart stats={stats} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">School AI Health Score</h3>
            <div className="text-6xl font-extrabold text-brand-600 my-6">
              {Math.round(((stats.low + stats.medium) / stats.total) * 100)}%
            </div>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">
              Percentage of students identified as low or medium risk for dropout. Keep monitoring critical interventions to improve this metric across the district.
            </p>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <StudentTable students={students} title="Student Directory" />
      </div>
    </div>
  );
}
