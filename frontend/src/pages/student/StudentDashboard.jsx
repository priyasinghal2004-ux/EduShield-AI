import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import ChatBot from '../../components/Chatbot/ChatBot';

export default function StudentDashboard() {
  const { currentUser } = useAuth();

  const [student, setStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!currentUser?.studentId) return;

      try {
        const [studentRes, predictionRes, interventionRes] =
          await Promise.all([
            axiosInstance.get(
              `/students/${currentUser.studentId}`
            ),

            axiosInstance.get(
              `/predictions/${currentUser.studentId}/latest`
            ),

            axiosInstance.get(
              `/interventions/student/${currentUser.studentId}`
            ),
          ]);

        setStudent(studentRes.data.data);
        setPrediction(predictionRes.data.data);
        setInterventions(
          interventionRes.data.data || []
        );
      } catch (error) {
        console.error(
          'Failed to load student dashboard:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-red-700">
            Unable to load your student profile.
          </p>
        </div>
      </div>
    );
  }

  const attendance = student.attendance;
  const academics = student.academics;

  const attendancePercentage =
    attendance?.totalDays > 0
      ? Math.round(
          (attendance.present / attendance.totalDays) * 100
        )
      : 0;

  const riskLabel =
    prediction?.riskLabel || 'low';

  const riskText = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk',
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {student.firstName} {student.lastName} 👋
        </h1>

        <p className="text-gray-600 mt-1">
          Here's an overview of your academic journey.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Risk */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Academic Status
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            {riskText[riskLabel] || 'Low Risk'}
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Based on your latest assessment
          </p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Attendance
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            {attendancePercentage}%
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {attendance.present} present out of{' '}
            {attendance.totalDays} days
          </p>
        </div>

        {/* GPA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Current GPA
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            {academics.gpa?.toFixed(2)}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {academics.failedCourses} failed course
            {academics.failedCourses !== 1 ? 's' : ''}
          </p>
        </div>

      </div>

      {/* Academic Performance + Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Grades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Academic Performance
          </h2>

          <div className="space-y-3">
            {academics.currentGrades?.map(
              (subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-3"
                >
                  <span className="text-gray-700">
                    {subject.course}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {subject.grade}
                  </span>
                </div>
              )
            )}
          </div>

        </div>

        {/* Interventions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Support
          </h2>

          {interventions.length > 0 ? (
            <div className="space-y-4">
              {interventions.map(
                (intervention, index) => (
                  <div
                    key={
                      intervention._id || index
                    }
                    className="p-3 bg-blue-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">
                      {intervention.type
                        ?.replace(/_/g, ' ')
                        ?.replace(/\b\w/g, c =>
                          c.toUpperCase()
                        )}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {intervention.description}
                    </p>

                    <p className="text-xs text-blue-600 mt-2">
                      Status:{' '}
                      {intervention.status}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              No support interventions at the moment.
            </p>
          )}

        </div>

      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-6">

        <h2 className="text-lg font-semibold text-gray-900">
          💙 Need Help?
        </h2>

        <p className="text-gray-600 mt-2">
          EduShield is here to support you with academic,
          emotional, financial, and other student concerns.
        </p>

      </div>

     <ChatBot />
    </div>
  );
}