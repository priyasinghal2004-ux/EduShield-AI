import { RISK_LEVELS } from '../constants/riskLevels'

/**
 * Map a 0–1 risk score to a risk tier label.
 * @param {number} score
 * @returns {'low'|'medium'|'high'|'critical'}
 */
export function getRiskLabel(score) {
  if (score >= RISK_LEVELS.CRITICAL.min) return 'critical'
  if (score >= RISK_LEVELS.HIGH.min)     return 'high'
  if (score >= RISK_LEVELS.MEDIUM.min)   return 'medium'
  return 'low'
}

/**
 * Return Tailwind CSS class set for a given risk level.
 */
export function getRiskClasses(label) {
  switch (label) {
    case 'critical': return 'risk-critical'
    case 'high':     return 'risk-high'
    case 'medium':   return 'risk-medium'
    case 'low':      return 'risk-low'
    default:         return 'risk-low'
  }
}

/**
 * Return a hex color string for a risk level (used in charts).
 */
export function getRiskColor(label) {
  switch (label) {
    case 'critical': return '#ef4444'  // red-500
    case 'high':     return '#f97316'  // orange-500
    case 'medium':   return '#eab308'  // yellow-500
    case 'low':      return '#22c55e'  // green-500
    default:         return '#64748b'  // slate-500
  }
}

/**
 * Return a display name for a risk label.
 */
export function getRiskDisplayLabel(label) {
  switch (label) {
    case 'critical': return 'Critical'
    case 'high':     return 'High Risk'
    case 'medium':   return 'Medium'
    case 'low':      return 'Low Risk'
    default:         return 'Unknown'
  }
}

/**
 * Return an emoji indicator for a risk level.
 */
export function getRiskEmoji(label) {
  switch (label) {
    case 'critical': return '🔴'
    case 'high':     return '🟠'
    case 'medium':   return '🟡'
    case 'low':      return '🟢'
    default:         return '⚪'
  }
}

/**
 * Return text color class for inline text risk coloring.
 */
export function getRiskTextColor(label) {
  switch (label) {
    case 'critical': return 'text-red-400'
    case 'high':     return 'text-orange-400'
    case 'medium':   return 'text-amber-400'
    case 'low':      return 'text-green-400'
    default:         return 'text-slate-400'
  }
}

/**
 * Return Tailwind bg color class for risk level fill.
 */
export function getRiskBgColor(label) {
  switch (label) {
    case 'critical': return 'bg-red-500/10'
    case 'high':     return 'bg-orange-500/10'
    case 'medium':   return 'bg-amber-500/10'
    case 'low':      return 'bg-green-500/10'
    default:         return 'bg-slate-500/10'
  }
}
