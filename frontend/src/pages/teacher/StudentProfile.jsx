import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Plus } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AttendanceCard from '../../components/student/AttendanceCard';
import GradesCard from '../../components/student/GradesCard';
import BehaviorCard from '../../components/student/BehaviorCard';
import ShapExplanationChart from '../../components/student/ShapExplanationChart';
import InterventionList from '../../components/intervention/InterventionList';
import InterventionForm from '../../components/intervention/InterventionForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { getRiskClasses, getRiskDisplayLabel, getRiskEmoji } from '../../utils/riskHelpers';
import { formatScore, formatDate } from '../../utils/formatters';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentRes = await axiosInstance.get(`/students/${id}`);
        setStudent(studentRes.data.data);
        
        try {
          const predRes = await axiosInstance.get(`/predictions/${id}/latest`);
          setPrediction(predRes.data.data);
        } catch (e) {
          // Trigger a prediction if one doesn't exist
          const newPredRes = await axiosInstance.post(`/predictions/${id}`);
          setPrediction(newPredRes.data.data);
        }

        const intRes = await axiosInstance.get(`/interventions/student/${id}`);
        setInterventions(intRes.data.data);

      } catch (err) {
        console.error('Failed to load student:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>;
  }

  if (!student) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-gray-500 text-lg">Student profile not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const riskLabel = prediction?.riskLabel || 'low';
  const riskScore = prediction?.riskScore || 0;

  const handleAddIntervention = async (data) => {
    try {
      const res = await axiosInstance.post('/interventions', {
        studentId: student.studentId,
        ...data
      });
      setInterventions([res.data.data, ...interventions]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to log intervention', err);
      alert('Failed to log intervention');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Navigation */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-3xl shrink-0">
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {student.firstName} {student.lastName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{student.studentId}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>Grade {student.grade}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{student.demographics.age} years old</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-gray-50 text-gray-600">
                <Mail className="w-3.5 h-3.5" /> Message Parent
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-gray-50 text-gray-600">
                <Phone className="w-3.5 h-3.5" /> Call Home
              </Button>
            </div>
          </div>
        </div>
        
        {/* Risk Score Highlight */}
        <div className={`shrink-0 rounded-xl p-6 border flex flex-col items-center justify-center min-w-[200px] ${getRiskClasses(riskLabel).replace('border', 'border-2')} bg-white`}>
          <div className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">
            AI Risk Score
          </div>
          <div className="text-5xl font-black flex items-center gap-2 mb-2">
            {formatScore(riskScore)}
          </div>
          <Badge className={getRiskClasses(riskLabel)}>
            {getRiskEmoji(riskLabel)} {getRiskDisplayLabel(riskLabel)}
          </Badge>
          <div className="text-xs opacity-70 mt-3 text-center">
            Last updated: {prediction?.createdAt ? formatDate(prediction.createdAt) : 'N/A'}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AttendanceCard attendance={student.attendance} />
        <GradesCard academics={student.academics} />
        <BehaviorCard behavior={student.behavior} />
      </div>

      {/* Deep Dive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SHAP Explanation */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900">Why did the AI assign this score?</h3>
            <p className="text-sm text-gray-500 mt-1">Feature impact analysis (SHAP values) indicating the top contributing factors.</p>
          </div>
          <div className="p-6 flex-1">
            {prediction?.shapValues && prediction.shapValues.length > 0 ? (
               <ShapExplanationChart shapValues={prediction.shapValues} />
            ) : (
               <p className="text-gray-500 text-center py-8">No SHAP data available for this prediction.</p>
            )}
          </div>
        </div>

        {/* Interventions */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Interventions</h3>
              <p className="text-sm text-gray-500 mt-0.5">Recorded actions taken</p>
            </div>
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 shrink-0">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            <InterventionList interventions={interventions} />
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Log New Intervention"
      >
        <InterventionForm 
          onSubmit={handleAddIntervention} 
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}
