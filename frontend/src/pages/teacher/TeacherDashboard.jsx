import ChatBot from "../../components/Chatbot/ChatBot";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RiskSummaryCard from '../../components/dashboard/RiskSummaryCard';
import StudentTable from '../../components/dashboard/StudentTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { Plus, Users, Calendar, AlertTriangle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { formatRelativeTime, formatInterventionType, formatInterventionStatus } from '../../utils/formatters';

export default function TeacherDashboard() {
  const { currentUser } = useAuth();

  const [students, setStudents] = useState([]);
  const [recentInterventions, setRecentInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helpRequests, setHelpRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await axiosInstance.get('/students');
        const studentsData = res.data.data;

        try {
          const helpRes = await axiosInstance.get("/help-requests");
          setHelpRequests(helpRes.data.data || []);
        } catch (e) {
          console.error("Failed to load help requests", e);
        }
        console.log("Teacher User:", currentUser);
        console.log("Students API:", studentsData);

        // Ensure predictions for all students
        const studentIds = studentsData.map(s => s.studentId);

        if (studentIds.length > 0) {
          try {
            await axiosInstance.post('/predictions/batch', { studentIds });
          } catch (e) {
            console.warn("Batch prediction failed:", e.message);
          }
        }

        let allInterventions = [];

        const enrichedStudents = await Promise.all(studentsData.map(async (student) => {
          try {
            const predRes = await axiosInstance.get(`/predictions/${student.studentId}/latest`);
            student.prediction = predRes.data.data || { riskScore: 0, riskLabel: 'low' };
          } catch (e) {
            student.prediction = { riskScore: 0, riskLabel: 'low' };
          }

          try {
            const intRes = await axiosInstance.get(`/interventions/student/${student.studentId}`);
            const ints = intRes.data.data.map(i => ({ ...i, student }));
            allInterventions = [...allInterventions, ...ints];
          } catch (e) { }

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

        allInterventions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentInterventions(allInterventions.slice(0, 5));

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name}</h1>
          <p className="text-gray-600 mt-1">Overview of students in {currentUser?.assignedClass || 'your class'}.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-white">
            <Calendar className="w-4 h-4" /> Schedule Meeting
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Log Intervention
          </Button>
        </div>
      </div>

      <RiskSummaryCard stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentTable students={students} title="My Classroom" />
        </div>
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors group">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-brand-700">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-sm">Review At-Risk Students</span>
                </div>
                <Badge variant="red">{stats.critical + stats.high}</Badge>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors group">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-brand-700">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-sm">Message Parents</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Interventions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100%-140px)]">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Interventions</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {recentInterventions.length === 0 ? (
                <div className="text-center p-6 text-gray-500 text-sm">No recent interventions logged.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentInterventions.map((intervention) => (
                    <div key={intervention._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <Link to={`/teacher/student/${intervention.student.studentId}`} className="font-medium text-sm text-gray-900 hover:text-brand-600 transition-colors">
                          {intervention.student.firstName} {intervention.student.lastName}
                        </Link>
                        <span className="text-xs text-gray-500">{formatRelativeTime(intervention.createdAt)}</span>
                      </div>
                      <div className="text-xs font-medium text-brand-600 mb-2">
                        {formatInterventionType(intervention.type)}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {intervention.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 italic">
                          Status: {formatInterventionStatus(intervention.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <Button variant="ghost" className="w-full text-sm">View All Interventions</Button>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}
