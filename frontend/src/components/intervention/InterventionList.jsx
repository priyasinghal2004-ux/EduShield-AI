import React from 'react';
import Badge from '../common/Badge';
import { formatRelativeTime, formatInterventionType, formatInterventionStatus } from '../../utils/formatters';

export default function InterventionList({ interventions }) {
  if (!interventions || interventions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No interventions recorded for this student.</p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'planned': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-4">
      {interventions.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((intervention) => (
        <div key={intervention._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                {formatInterventionType(intervention.type)}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Logged {formatRelativeTime(intervention.createdAt)}
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(intervention.status)}>
              {formatInterventionStatus(intervention.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">
            {intervention.description}
          </p>
        </div>
      ))}
    </div>
  );
}
