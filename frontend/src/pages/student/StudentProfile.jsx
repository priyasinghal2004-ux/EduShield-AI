import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import ChatBot from '../../components/Chatbot/ChatBot';

export default function StudentProfile() {
  const { currentUser } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.studentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/students/${currentUser.studentId}`
        );

        setStudent(response.data.data);
      } catch (error) {
        console.error('Failed to load student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-red-700">
            Unable to load your profile.
          </p>
        </div>
      </div>
    );
  }

  const attendancePercentage =
    student.attendance?.totalDays > 0
      ? Math.round(
          (student.attendance.present /
            student.attendance.totalDays) *
            100
        )
      : 0;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Student Profile
        </h1>

        <p className="text-gray-600 mt-1">
          View your personal and academic information.
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">

        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900 mt-1">
              {student.firstName} {student.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="font-medium text-gray-900 mt-1">
              {student.studentId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Grade</p>
            <p className="font-medium text-gray-900 mt-1">
              Grade {student.grade}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-medium text-gray-900 mt-1">
              {student.assignedClass || 'Not assigned'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-medium text-gray-900 mt-1">
              {student.demographics?.age || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Enrollment Status</p>
            <p className="font-medium text-green-600 mt-1 capitalize">
              {student.enrollmentStatus}
            </p>
          </div>

        </div>
      </div>

      {/* Academic + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Academic */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Academic Information
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-5">

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">GPA</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {student.academics?.gpa?.toFixed(2)}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Failed Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {student.academics?.failedCourses || 0}
              </p>
            </div>

          </div>

          <h3 className="font-medium text-gray-900 mb-3">
            Current Grades
          </h3>

          <div className="space-y-3">
            {student.academics?.currentGrades?.map(
              (subject, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-gray-100 pb-3"
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

        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Attendance
          </h2>

          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-blue-600">
              {attendancePercentage}%
            </p>

            <p className="text-gray-500 mt-1">
              Overall Attendance
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">

            <div className="text-center bg-green-50 rounded-lg p-3">
              <p className="text-xl font-semibold text-green-700">
                {student.attendance?.present || 0}
              </p>
              <p className="text-xs text-gray-500">
                Present
              </p>
            </div>

            <div className="text-center bg-red-50 rounded-lg p-3">
              <p className="text-xl font-semibold text-red-700">
                {student.attendance?.absent || 0}
              </p>
              <p className="text-xs text-gray-500">
                Absent
              </p>
            </div>

            <div className="text-center bg-yellow-50 rounded-lg p-3">
              <p className="text-xl font-semibold text-yellow-700">
                {student.attendance?.tardy || 0}
              </p>
              <p className="text-xs text-gray-500">
                Tardy
              </p>
            </div>

          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">
              Consecutive Absences
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {student.attendance?.consecutiveAbsences || 0} days
            </p>
          </div>

        </div>

      </div>
      <ChatBot />
    </div>
  );
}