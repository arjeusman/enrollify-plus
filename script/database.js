import Users from '../data/users.json' assert { type: 'json' }
import Advisory from '../data/sections.json' assert { type: 'json' }
import Students from '../data/students.json' assert { type: 'json' }
import Grades from '../data/grades.json' assert { type: 'json' }

let tempUsers = localStorage.getItem('enrollify_users')
let tempAdvisory = localStorage.getItem('enrollify_advisory')
let tempStudents = localStorage.getItem('enrollify_students')
let tempGrades = localStorage.getItem('enrollify_grades')

if (tempUsers == null) {
    localStorage.setItem('enrollify_users', JSON.stringify(Users))
}

if (tempAdvisory == null) {
    localStorage.setItem('enrollify_advisory', JSON.stringify(Advisory))
}

if (tempStudents == null) {
    localStorage.setItem('enrollify_students', JSON.stringify(Students))
}

if (tempGrades == null) {
    localStorage.setItem('enrollify_grades', JSON.stringify(Grades))
}
