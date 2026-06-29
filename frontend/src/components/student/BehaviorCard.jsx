import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function BehaviorCard({ behavior }) {
  const { disciplinaryIncidents, referrals, suspensions } = behavior;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Behavior</h3>
          <p className="text-sm text-gray-500">Incident Records</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Disciplinary Incidents</p>
              <p className="text-xs text-gray-500 mt-1">Total recorded events</p>
            </div>
            <span className={`text-2xl font-bold ${disciplinaryIncidents > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
              {disciplinaryIncidents}
            </span>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Office Referrals</p>
            </div>
            <span className={`text-xl font-bold ${referrals > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
              {referrals}
            </span>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Suspensions</p>
            </div>
            <span className={`text-xl font-bold ${suspensions > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {suspensions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
