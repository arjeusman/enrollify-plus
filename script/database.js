import gzUsers from '../gz-users.json' assert { type: 'json' }
import gzAdvisory from '../gz-advisory.json' assert { type: 'json' }
import gzStudents from '../gz-students.json' assert { type: 'json' }
import gzGrades from '../gz-grades.json' assert { type: 'json' }

let tempUsers = localStorage.getItem('gz_users')
let tempAdvisory = localStorage.getItem('gz_advisory')
let tempStudents = localStorage.getItem('gz_students')
let tempGrades = localStorage.getItem('gz_grades')

if (tempUsers == null) {
    localStorage.setItem('gz_users', JSON.stringify(gzUsers))
}

if (tempAdvisory == null) {
    localStorage.setItem('gz_advisory', JSON.stringify(gzAdvisory))
}

if (tempStudents == null) {
    localStorage.setItem('gz_students', JSON.stringify(gzStudents))
}

if (tempGrades == null) {
    localStorage.setItem('gz_grades', JSON.stringify(gzGrades))
}
