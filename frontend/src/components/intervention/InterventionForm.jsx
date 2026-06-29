import React, { useState } from 'react';
import Button from '../common/Button';

export default function InterventionForm({ onSubmit, onCancel }) {
  const [type, setType] = useState('attendance_meeting');
  const [status, setStatus] = useState('planned');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, status, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intervention Type</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        >
          <option value="attendance_meeting">Attendance Meeting</option>
          <option value="academic_support">Academic Support</option>
          <option value="mental_health_referral">Mental Health Referral</option>
          <option value="parent_contact">Parent Contact</option>
          <option value="financial_aid">Financial Aid</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
        >
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
        <textarea 
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm resize-none"
          placeholder="Details of the intervention..."
        />
      </div>

      <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Intervention</Button>
      </div>
    </form>
  );
}
