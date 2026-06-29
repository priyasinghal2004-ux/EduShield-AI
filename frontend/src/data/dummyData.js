// ─── Dummy Student Data Generator ───────────────────────────────────────────
// Generates 30 realistic student records for the frontend.

const firstNames = ['James','Sofia','Marcus','Aisha','Ethan','Lily','Jordan','Destiny','Noah','Priya','Carlos','Emma','Lucas','Mia','Benjamin','Isabella','Elijah','Ava','William','Sophia','Mason','Charlotte','Michael','Amelia','Alexander','Harper','Jacob','Evelyn','Logan','Abigail'];
const lastNames = ['Mitchell','Hernandez','Thompson','Okafor','Park','Chen','Rivera','Williams','Johnson','Sharma','Mendez','Davis','Miller','Garcia','Rodriguez','Martinez','Brown','Jones','Smith','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Lee','Walker','Hall','Allen'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function generateStudent(idIndex) {
  const isHighRisk = Math.random() < 0.2; // 20% chance of being high/critical risk
  const isMediumRisk = Math.random() < 0.3; // 30% chance of being medium risk
  
  const grade = randomInt(9, 12);
  const totalDays = 180;
  
  let presentDays, absentDays, tardy, consecutiveAbsences, gpa, failedCourses, disciplinaryIncidents, riskScore;
  
  if (isHighRisk) {
    presentDays = randomInt(100, 140);
    gpa = randomFloat(1.0, 2.2);
    failedCourses = randomInt(1, 4);
    disciplinaryIncidents = randomInt(2, 8);
    consecutiveAbsences = randomInt(3, 8);
    riskScore = randomFloat(0.75, 0.98);
  } else if (isMediumRisk) {
    presentDays = randomInt(140, 160);
    gpa = randomFloat(2.0, 2.8);
    failedCourses = randomInt(0, 2);
    disciplinaryIncidents = randomInt(0, 3);
    consecutiveAbsences = randomInt(0, 4);
    riskScore = randomFloat(0.40, 0.74);
  } else {
    presentDays = randomInt(160, 180);
    gpa = randomFloat(2.8, 4.0);
    failedCourses = 0;
    disciplinaryIncidents = randomInt(0, 1);
    consecutiveAbsences = randomInt(0, 1);
    riskScore = randomFloat(0.05, 0.39);
  }
  
  absentDays = totalDays - presentDays;
  tardy = randomInt(0, 15);
  
  let riskLabel = 'low';
  if (riskScore >= 0.8) riskLabel = 'critical';
  else if (riskScore >= 0.6) riskLabel = 'high';
  else if (riskScore >= 0.4) riskLabel = 'medium';

  const shapValues = [
    { feature: 'Attendance Rate', value: (1 - (presentDays / totalDays)) * 0.5 * (Math.random() > 0.5 ? 1 : -1), direction: (1 - (presentDays / totalDays)) > 0.15 ? 'positive' : 'negative' },
    { feature: 'GPA', value: (3.0 - gpa) * 0.2, direction: gpa < 2.5 ? 'positive' : 'negative' },
    { feature: 'Failed Courses', value: failedCourses * 0.15, direction: failedCourses > 0 ? 'positive' : 'negative' },
    { feature: 'Disciplinary Incidents', value: disciplinaryIncidents * 0.1, direction: disciplinaryIncidents > 0 ? 'positive' : 'negative' },
    { feature: 'Consecutive Absences', value: consecutiveAbsences * 0.08, direction: consecutiveAbsences > 2 ? 'positive' : 'negative' },
    { feature: 'Tardiness Count', value: tardy * 0.02, direction: tardy > 5 ? 'positive' : 'negative' },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  // Fix SHAP values signs for realistic display
  shapValues.forEach(s => {
    s.direction = s.value > 0 ? 'positive' : 'negative';
  });

  const interventions = [];
  if (riskScore > 0.6) {
    interventions.push({
      _id: `i${idIndex}_1`,
      type: 'attendance_meeting',
      description: 'Discussed attendance concerns with parents.',
      status: 'completed',
      createdAt: new Date(Date.now() - randomInt(1, 14) * 86400000).toISOString()
    });
    if (riskScore > 0.8) {
      interventions.push({
        _id: `i${idIndex}_2`,
        type: 'academic_support',
        description: 'Enrolled in after-school tutoring.',
        status: 'in_progress',
        createdAt: new Date(Date.now() - randomInt(1, 5) * 86400000).toISOString()
      });
    }
  }

  return {
    _id: `s${idIndex}`,
    studentId: `STU-${String(idIndex).padStart(3, '0')}`,
    firstName: firstNames[idIndex % firstNames.length],
    lastName: lastNames[idIndex % lastNames.length],
    grade,
    assignedClass: idIndex % 2 === 0 ? 'Class-A' : 'Class-B',
    enrollmentStatus: 'enrolled',
    demographics: { age: grade + 5, gender: idIndex % 2 === 0 ? 'Female' : 'Male' },
    attendance: { totalDays, present: presentDays, absent: absentDays, tardy, consecutiveAbsences },
    academics: {
      gpa,
      failedCourses,
      currentGrades: [
        { course: 'Mathematics', grade: gpa > 3 ? 'A' : gpa > 2 ? 'C' : 'F' },
        { course: 'English', grade: gpa > 3 ? 'A-' : gpa > 2 ? 'B' : 'D' },
        { course: 'Science', grade: gpa > 3 ? 'B+' : gpa > 2 ? 'C' : 'F' },
      ],
    },
    behavior: { disciplinaryIncidents, referrals: Math.floor(disciplinaryIncidents / 2), suspensions: Math.floor(disciplinaryIncidents / 4) },
    prediction: {
      riskScore,
      riskLabel,
      shapValues,
      generatedAt: new Date().toISOString(),
    },
    interventions,
  };
}

export const DUMMY_STUDENTS = Array.from({ length: 30 }, (_, i) => generateStudent(i + 1));

// ─── Dummy Users ──────────────────────────────────────────────────────────────
export const DUMMY_USERS = [
  { _id: 'u1', name: 'Dr. Sarah Admin', email: 'admin@edushield.ai',   role: 'admin',   isActive: true, createdAt: '2026-01-10' },
  { _id: 'u2', name: 'Maria Flores',    email: 'teacher@edushield.ai', role: 'teacher', isActive: true, assignedClass: 'Class-A', createdAt: '2026-01-12' },
  { _id: 'u3', name: 'Alex Johnson',    email: 'alex@edushield.ai',    role: 'teacher', isActive: true, assignedClass: 'Class-B', createdAt: '2026-01-15' },
]

// ─── Mock Auth Credentials ────────────────────────────────────────────────────
export const MOCK_CREDENTIALS = {
  'admin@edushield.ai':   { password: 'admin123',   user: DUMMY_USERS[0] },
  'teacher@edushield.ai': { password: 'teacher123', user: DUMMY_USERS[1] },
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export function getDashboardStats() {
  const students = DUMMY_STUDENTS
  const critical = students.filter(s => s.prediction.riskLabel === 'critical').length
  const high     = students.filter(s => s.prediction.riskLabel === 'high').length
  const medium   = students.filter(s => s.prediction.riskLabel === 'medium').length
  const low      = students.filter(s => s.prediction.riskLabel === 'low').length
  return { total: students.length, critical, high, medium, low }
}
