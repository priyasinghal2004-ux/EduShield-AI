require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./src/models/Student.model");

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Arjun", "Krishna",
  "Priya", "Ananya", "Diya", "Aditi", "Kavya",
  "Rohan", "Rahul", "Sneha", "Neha", "Ishita",
  "Aryan", "Saanvi", "Ansh", "Pooja", "Yash",
  "Harsh", "Nikhil", "Meera", "Ritika", "Tanvi",
  "Shreya", "Dev", "Karan", "Muskan", "Vaishnavi"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Singh", "Patel",
  "Yadav", "Kumar", "Joshi", "Mishra", "Agarwal",
  "Jain", "Mehta", "Reddy", "Nair", "Iyer",
  "Chauhan", "Saxena", "Bansal", "Kapoor", "Malhotra",
  "Pandey", "Tiwari", "Srivastava", "Soni", "Arora",
  "Thakur", "Choudhary", "Dubey", "Bhardwaj", "Goyal"
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Purane students delete kar do (optional)
    await Student.deleteMany({});

    const students = [];

    for (let i = 1; i <= 30; i++) {
      const grade = rand(9, 12);
      const totalDays = 180;
      const present = rand(120, 180);

      students.push({
        studentId: `STU-${String(i).padStart(3, "0")}`,
        firstName: firstNames[(i - 1) % firstNames.length],
        lastName: lastNames[(i - 1) % lastNames.length],
        grade,
        assignedClass: i % 2 === 0 ? "Class-A" : "Class-B",
        enrollmentStatus: "enrolled",

        demographics: {
          age: grade + 5,
          gender: i % 2 === 0 ? "Female" : "Male"
        },

        attendance: {
          totalDays,
          present,
          absent: totalDays - present,
          tardy: rand(0, 10),
          consecutiveAbsences: rand(0, 4)
        },

        academics: {
          gpa: +(Math.random() * 2 + 2).toFixed(2),
          failedCourses: rand(0, 2),
          currentGrades: [
            {
              course: "Mathematics",
              grade: "A"
            },
            {
              course: "Science",
              grade: "B"
            },
            {
              course: "English",
              grade: "A-"
            }
          ]
        },

        behavior: {
          disciplinaryIncidents: rand(0, 2),
          referrals: rand(0, 1),
          suspensions: 0
        }
      });
    }

    await Student.insertMany(students);

    console.log(`✅ ${students.length} students inserted successfully`);

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = seed;