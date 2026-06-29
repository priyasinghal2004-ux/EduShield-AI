/**
 * Format a date string into a human-readable format.
 * @param {string|Date} dateString
 * @returns {string} e.g. "Jun 29, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '—';

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date into relative time (e.g. "3 days ago").
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '—'
  const now  = Date.now()
  const then = new Date(dateString).getTime()
  const diff = now - then

  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  < 30) return `${days}d ago`
  return formatDate(dateString)
}

/**
 * Format a risk score (0–1) as a percentage string.
 * @param {number} score
 * @returns {string} e.g. "82%"
 */
export function formatScore(score) {
  if (score === null || score === undefined) return '—'
  return `${Math.round(score * 100)}%`
}

/**
 * Format a GPA number.
 */
export function formatGPA(gpa) {
  if (gpa === null || gpa === undefined) return '—'
  return Number(gpa).toFixed(2)
}

/**
 * Format an attendance rate from { present, totalDays }.
 */
export function formatAttendanceRate(present, totalDays) {
  if (!totalDays) return '—'
  return `${Math.round((present / totalDays) * 100)}%`
}

/**
 * Format a full name as "Last, First".
 */
export function formatName(firstName, lastName) {
  if (!firstName && !lastName) return '—'
  if (!lastName)  return firstName
  if (!firstName) return lastName
  return `${lastName}, ${firstName}`
}

/**
 * Format a full name as "First Last".
 */
export function formatFullName(firstName, lastName) {
  return `${firstName || ''} ${lastName || ''}`.trim() || '—'
}

/**
 * Get a student's initials from first and last name.
 */
export function getInitials(firstName, lastName) {
  const f = (firstName || '').charAt(0).toUpperCase()
  const l = (lastName  || '').charAt(0).toUpperCase()
  return `${f}${l}` || '?'
}

/**
 * Format a grade number as ordinal string.
 * @param {number} grade
 * @returns {string} e.g. "10th Grade"
 */
export function formatGrade(grade) {
  if (!grade) return '—'
  const suffixes = { 1:'st', 2:'nd', 3:'rd' }
  const suffix = suffixes[grade] || 'th'
  return `${grade}${suffix} Grade`
}

/**
 * Format an intervention type into a display string.
 */
export function formatInterventionType(type) {
  const map = {
    academic_support:      'Academic Support',
    attendance_meeting:    'Attendance Meeting',
    mental_health_referral:'Mental Health Referral',
    parent_contact:        'Parent Contact',
    financial_aid:         'Financial Aid',
    other:                 'Other',
  }
  return map[type] || type
}

/**
 * Format an intervention status.
 */
export function formatInterventionStatus(status) {
  const map = {
    planned:     'Planned',
    in_progress: 'In Progress',
    completed:   'Completed',
  }
  return map[status] || status
}
