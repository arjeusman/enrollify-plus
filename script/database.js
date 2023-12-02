import Users from '../data/users.json' assert { type: 'json' }
import Sections from '../data/sections.json' assert { type: 'json' }
import Students from '../data/students.json' assert { type: 'json' }
import Grades from '../data/grades.json' assert { type: 'json' }

let tempUsers = localStorage.getItem('enrollify_users')
let tempSections = localStorage.getItem('enrollify_sections')
let tempStudents = localStorage.getItem('enrollify_students')
let tempGrades = localStorage.getItem('enrollify_grades')

if (tempUsers == null) {
    localStorage.setItem('enrollify_users', JSON.stringify(Users))
}

if (tempSections == null) {
    localStorage.setItem('enrollify_sections', JSON.stringify(Sections))
}

if (tempStudents == null) {
    localStorage.setItem('enrollify_students', JSON.stringify(Students))
}

if (tempGrades == null) {
    localStorage.setItem('enrollify_grades', JSON.stringify(Grades))
}
