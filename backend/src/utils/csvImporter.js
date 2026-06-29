const { parse } = require('csv-parse/sync');

class CSVImporter {
  parseCSVBuffer(buffer) {
    const valid = [];
    const errors = [];
    let records;
    try {
      records = parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (err) {
      return { valid, errors: ['Failed to parse CSV format'] };
    }

    records.forEach((row, index) => {
      try {
        const student = this.mapRowToStudent(row);
        valid.push(student);
      } catch (err) {
        errors.push(`Row ${index + 2}: ${err.message}`);
      }
    });

    return { valid, errors };
  }

  mapRowToStudent(row) {
    if (!row.studentId || !row.firstName || !row.lastName || !row.grade) {
      throw new Error('Missing required fields (studentId, firstName, lastName, grade)');
    }

    return {
      studentId: row.studentId,
      firstName: row.firstName,
      lastName: row.lastName,
      grade: parseInt(row.grade, 10),
      assignedClass: row.assignedClass || null,
      demographics: {
        age: parseInt(row.age, 10) || null,
        gender: row.gender || null
      },
      attendance: {
        totalDays: parseInt(row.totalDays, 10) || 180,
        present: parseInt(row.present, 10) || 0,
        absent: parseInt(row.absent, 10) || 0,
        tardy: parseInt(row.tardy, 10) || 0,
        consecutiveAbsences: parseInt(row.consecutiveAbsences, 10) || 0
      },
      academics: {
        gpa: parseFloat(row.gpa) || 0.0,
        failedCourses: parseInt(row.failedCourses, 10) || 0
      },
      behavior: {
        disciplinaryIncidents: parseInt(row.disciplinaryIncidents, 10) || 0,
        referrals: parseInt(row.referrals, 10) || 0,
        suspensions: parseInt(row.suspensions, 10) || 0
      }
    };
  }
}

module.exports = new CSVImporter();
