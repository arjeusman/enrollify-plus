//check if user is signed in
function checkAuth(){
    let id = localStorage.getItem('current_user')
    if (id == null || id == '' || id == undefined) {
        Swal.fire({
            icon: 'warning',
            iconHtml: '<i class="fa-solid fa-triangle-exclamation"></i>',
            html: 'Please login your account. Redirecting you to the signin page.',
            allowOutsideClick: false,
            showConfirmButton: false,
            width: 400,
            padding: 20,
            showClass: {
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show bg-dark',
                icon: 'swal2-icon-show'
            }
        })
        window.setTimeout((e) => {
            window.location.href = 'signin.html'
        }, 2000)
    }
}

//redirect if user is signed in
function isSigned() {
    let id = localStorage.getItem('current_user')
    if (id != null) {
        Swal.fire({
            icon: 'warning',
            iconHtml: '<i class="fa-solid fa-lock"></i>',
            html: 'You are already signed in. Redirecting you to the dashboard.',
            allowOutsideClick: false,
            showConfirmButton: false,
            width: 400,
            padding: 20,
            showClass: {
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show bg-dark bg-opacity-75',
                icon: 'swal2-icon-show'
            }
        })
        Redirect('dashboard.html')
    }
}

//check if current school is set
function isSchoolSelected(){
    let id = localStorage.getItem('current_school')
    if (id == null || id == '' || id == undefined) {
        Swal.fire({
            icon: 'warning',
            iconHtml: '<i class="fa-solid fa-triangle-exclamation"></i>',
            html: 'Please select a school. Redirecting you to the dashboard.',
            allowOutsideClick: false,
            showConfirmButton: false,
            width: 400,
            padding: 20,
            showClass: {
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show bg-dark',
                icon: 'swal2-icon-show'
            }
        })
        window.setTimeout((e) => {
            window.location.href = 'dashboard.html'
        }, 2000)
    }
}

function logout() {
    Swal.fire({
        icon: 'warning',
        iconHtml: '<i class="fa-solid fa-question"></i>',
        html: 'Are you sure you want to logout?',
        width: 350,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
        cancelButtonText: '<i class="fa-solid fa-times"></i> No',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn px-4 btn-danger bg-gradient me-2',
            cancelButton: 'btn px-4 btn-success bg-gradient',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Process('Logging out please wait')
            localStorage.removeItem('current_user')
            Redirect('signin.html')
        }
    })
}

function Process(message = 'Processing please wait.', duration=3000) {
    let html;
    html = '<div class="d-flex align-items-center justify-content-center p-4">'
    html = html.concat('<div class="gauge">')
    html = html.concat('<div class="spinner spinner-border text-warning opacity-25"></div>')
    html = html.concat('<div class="spinner spinner-grow text-warning opacity-25"></div>')
    html = html.concat('</div>')
    html = html.concat('</div>')
    html = html.concat('<p class="text-muted">' + message + '</p>')
    Swal.fire({
        html: html,
        allowOutsideClick: false,
        showConfirmButton: false,
        width: 350,
        padding: 20,
        timer: duration
    })
}

function Success(message, redirect) {
    window.setTimeout(function () {
        Swal.fire({
            icon: 'success',
            html: message,
            allowOutsideClick: false,
            showConfirmButton: false,
            width: 350,
            padding: 20
        });
        window.setTimeout(function(){
            if (redirect==undefined) {
                window.location.reload()
            } else {
                window.location.href = redirect
            }
        }, 1000);
    }, 1000);
}

function Redirect(redirect) {
    window.setTimeout(function () {
        if (redirect == undefined) {
            window.location.reload()
        } else {
            window.location.href = redirect
        }
    }, 1000)
}

//function for schools

function viewSchool(school){
    Process()
    localStorage.setItem('current_school', school.id)
    Redirect('students.html')
}

function getSchool(id) {
    let data = JSON.parse(localStorage.getItem('enrollify_schools'))
    let a = {}
    data.forEach((d) => {
        if (d.id == id) {
            a = d
        }
    })
    return a
}

function getSchools() {
    let user = parseInt(localStorage.getItem('current_user'))
    let data = JSON.parse(localStorage.getItem('enrollify_schools'))
    let a = []
    data.forEach((d) => (d.user == user) && a.push(d))
    return a
}

function addSchool(school) {
    new bootstrap.Modal(document.querySelector("#addSchool")).show() //show form
    let form = document.forms.namedItem('addSchool')
    let isAdd = (school != undefined)?false:true
    if (school != undefined) {
        form.school_id.value = school.school_id
        form.school_name.value = school.school_name
        form.school_region.value = school.school_region
        form.school_division.value = school.school_division
        form.school_district.value = school.school_district
        form.school_principal.value = school.school_principal
        form.button.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes'
    } else {
        form.button.innerHTML = '<i class="fa-solid fa-plus"></i> Add School'
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            let data = JSON.parse(localStorage.getItem('enrollify_schools'))
            if (isAdd) {
                let newSchool = {
                    "id": Date.now(),
                    "user": parseInt(localStorage.getItem('current_user')),
                    "school_id": parseInt(form.school_id.value),
                    "school_name": form.school_name.value,
                    "school_region": form.school_region.value,
                    "school_division": form.school_division.value,
                    "school_district": form.school_district.value,
                    "school_principal": form.school_principal.value
                }
                data.push(newSchool)
                localStorage.setItem('enrollify_schools', JSON.stringify(data))
                Process('Adding school please wait.')
                Success('School was added successfully.')
            } else {
                data.forEach((d) => {
                    if (d.id == school.id) {
                        d.school_id = parseInt(form.school_id.value)
                        d.school_name = form.school_name.value
                        d.school_region = form.school_region.value
                        d.school_division = form.school_division.value
                        d.school_district = form.school_district.value
                        d.school_principal = form.school_principal.value
                    }
                })
                localStorage.setItem('enrollify_schools', JSON.stringify(data))
                Process('Updating school please wait.')
                Success('School was updated successfully.')
            }
        }
        form.classList.add('was-validated')
    }, false)
}

function deleteSchool(school) {
    Swal.fire({
        icon: 'warning',
        iconColor: '#f3676e',
        iconHtml: '<i class="fa-solid fa-question"></i>',
        html: 'Are you sure you want to delete <b class="fw-bolder">'+school.school_name+'</b>?',
        width: 350,
        padding: 20,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
        cancelButtonText: '<i class="fa-solid fa-times"></i> No',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn px-4 btn-danger bg-gradient me-2',
            cancelButton: 'btn px-4 btn-success bg-gradient',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Process('Deleting please wait.')
            let data = JSON.parse(localStorage.getItem('enrollify_schools'))
            let new_data = []
            data.forEach((d) => {
                return (d.id!=school.id) && new_data.push(d)
            })
            localStorage.setItem('enrollify_schools', JSON.stringify(new_data))//update schools
            localStorage.removeItem('current_school')
            Success('School was deleted successfully.')
        }
    })
}

// function for users

function getUser(email, password) {
    let data = JSON.parse(localStorage.getItem('enrollify_users'))
    let a
    data.forEach((d) => {
        if (d.email == email && d.password == password) {
            a = d
        }
    })
    return a
}

function getUsers() {
    let data = JSON.parse(localStorage.getItem('enrollify_users'))
    return data
}

function getUserInfo() {
    let id = localStorage.getItem('enrollify_current_user')
    let data = JSON.parse(localStorage.getItem('enrollify_users'))
    let a = {}
    data.forEach((d) => {
       (d.id == id) && (a = d)
    })
    return a
}

function getUserById(id) {
    let data = JSON.parse(localStorage.getItem('enrollify_users'))
    let a = {}
    data.forEach((d) => {
       (d.id == id) && (a = d)
    })
    return a
}

// function for sections

function viewSection(section){
    Process()
    localStorage.setItem('current_section', section.id)
    Redirect('section-view.html')
}

function getSection(id) {
    {(id==undefined) && (id = parseInt(localStorage.getItem('current_section')))}
    let data = JSON.parse(localStorage.getItem('enrollify_sections'))
    let a = {}
    data.forEach((d) => {
        if (d.id == id) {
            a = d
        }
    })
    return a
}

function getSections() {
    let user = parseInt(localStorage.getItem('current_user'))
    let school = parseInt(localStorage.getItem('current_school'))
    let data = JSON.parse(localStorage.getItem('enrollify_sections'))
    let a = []
    data.forEach((d) => {
        if (d.user == user || d.school == school) {
            d.male = countMale(d.id)
            d.female = countFemale(d.id)
            d.total = d.male + d.female
            a.push(d)
        }
    })
    return a
}

function getStudentsInSection(section) {
    let data = []
    let students = JSON.parse(localStorage.getItem('enrollify_students'))
    students.forEach((student) => {
        if (section.id == student.section) data.push(student)
    })
    return data
}

function countMale(id) {
    let data = JSON.parse(localStorage.getItem('enrollify_students'))
    let a = []
    data.forEach((d) => {
        if (d.section == id && d.gender == 'male') {
            a.push(d)
        }
    })
    return a.length
}

function countFemale(id) {
    let data = JSON.parse(localStorage.getItem('enrollify_students'))
    let a = []
    data.forEach((d) => {
        if (d.section == id && d.gender == 'female') {
            a.push(d)
        }
    })
    return a.length
}

function addSection() {
    new bootstrap.Modal(document.querySelector("#addSection")).show() //show form
    let form = document.forms.namedItem('addSection')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            let data = {
                "id": Date.now(),
                "school": parseInt(localStorage.getItem('current_school')),
                "user": parseInt(localStorage.getItem('current_user')),
                "name": form.name.value,
                "level": parseInt(form.level.value)
            }
            let section = JSON.parse(localStorage.getItem('enrollify_sections'))
            section.push(data)
            localStorage.setItem('enrollify_sections', JSON.stringify(section))
            Process('Adding please wait.')
            Success('Section was added successfully.')
        }
        form.classList.add('was-validated')
    }, false)
}

function editSection(section) {
    new bootstrap.Modal(document.querySelector("#editSection")).show() //show form
    let form = document.forms.namedItem('editSection')
    form.section_id.value = section.id
    form.section_name.value = section.name
    let index = 0
    index = (section.level == 7) ? 1 : index
    index = (section.level == 8) ? 2 : index
    index = (section.level == 9) ? 3 : index
    index = (section.level == 10) ? 4 : index
    form.section_level.selectedIndex = index
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            Process('Editing please wait.')
            {
                let advisories = JSON.parse(localStorage.getItem('enrollify_sections'))
                let new_advisories = []
                advisories.forEach((item) => {
                    if (item.id == section.id) {
                        item.name = form.section_name.value
                        item.level = parseInt(form.section_level.value)
                    }
                    new_advisories.push(item)
                })
                localStorage.setItem('enrollify_sections', JSON.stringify(new_advisories))
                Success('Section was updated successfully.')
            }
        }
        form.classList.add('was-validated')
    }, false)
}

function deleteSection(section) {
    Swal.fire({
        icon: 'warning',
        iconColor: '#f3676e',
        iconHtml: '<i class="fa-solid fa-question"></i>',
        html: 'Are you sure you want to delete <b class="fw-bolder">Grade '+section.level+' '+section.name+'</b>?',
        width: 350,
        padding: 20,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
        cancelButtonText: '<i class="fa-solid fa-times"></i> No',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn px-4 btn-danger bg-gradient me-2',
            cancelButton: 'btn px-4 btn-success bg-gradient',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Process('Deleting please wait.')
            let data = JSON.parse(localStorage.getItem('enrollify_sections'))
            let new_data = []
            data.forEach((d) => {
                return (d.id!=section.id) && new_data.push(d)
            })
            localStorage.setItem('enrollify_sections', JSON.stringify(new_data))//update section
            //delete all students inside the section
            new_data = []
            data = JSON.parse(localStorage.getItem('enrollify_students'))
            data.forEach((d) => {
                return (d.section!=section.id) && new_data.push(d)
            })
            localStorage.setItem('enrollify_students', JSON.stringify(new_data))//update students
            localStorage.removeItem('current_section')
            Success('Section was deleted successfully.', 'sections.html')
        }
    })
}

function assignAdviser() {
    new bootstrap.Modal(document.querySelector("#assignAdviser")).show() //show form
    let form = document.forms.namedItem('assignAdviser')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            let section = getSection(localStorage.getItem('current_section'))
            let user = getUserById(parseInt(form.user.value))
            Swal.fire({
                icon: 'warning',
                iconColor: '#f3676e',
                iconHtml: '<i class="fa-solid fa-question"></i>',
                html: 'Are you sure you want to assign <b class="fw-bolder">'+user.firstname+'</b> as the Adviser?',
                width: 350,
                padding: 20,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
                cancelButtonText: '<i class="fa-solid fa-times"></i> No',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn px-4 btn-danger bg-gradient me-2',
                    cancelButton: 'btn px-4 btn-success bg-gradient',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    Process('Assigning please wait.')
                    let data = JSON.parse(localStorage.getItem('enrollify_sections'))//get sections
                    data.forEach((d) => {
                        if (d.id == section.id) {
                            d.user = user.id
                        }
                    })
                    console.log(user)
                    // localStorage.setItem('enrollify_sections', JSON.stringify(data))//update sections
                    // Success('Adviser was assiged successfully.')
                }
            })
        }
        form.classList.add('was-validated')
    }, false)
}


//functions for students

function Students() {
    let data = JSON.parse(localStorage.getItem('enrollify_students'))
    return data
}

function getStudent(id) {
    let data = JSON.parse(localStorage.getItem('enrollify_students'))
    let a = {}
    data.forEach((d) => {
        if (d.id == id) {
            a = d
        }
    })
    return a
}

function getStudents() {
    let data = []
    let sections = []
    getSections().forEach((s) => sections.push(s.id))
    Students().forEach((s) => {
        {((sections.includes(s.section))) && data.push(s)}
    })
    return data
}

function viewStudent(student){
    Process()
    localStorage.setItem('current_student', student.id)
    Redirect('student-view.html')
}

function addStudent(form) {
    let data = {}
    let id = Date.now()
    let section = localStorage.getItem('current_section')
    //set data
    data.id = parseInt(id)
    data.section = parseInt(section)
    data.lrn = form.lrn.value
    data.firstname = form.firstname.value
    data.middlename = form.middlename.value
    data.lastname = form.lastname.value
    data.gender = form.gender.value
    data.age = parseInt(form.age.value)
    data.birthdate = form.birthdate.value
    let students = localStorage.getItem('enrollify_students')
    students = JSON.parse(students)
    students.push(data)
    localStorage.setItem('enrollify_students', JSON.stringify(students))
    Process()
    Success('Student was added successfully.')
}

function editStudent(student) {
    new bootstrap.Modal(document.querySelector("#editStudent")).show() //show form
    let form = document.forms.namedItem('editStudent')
    form.student_id.value = student.id
    form.student_lrn.value = student.lrn
    form.student_firstname.value = student.firstname
    form.student_middlename.value = student.middlename
    form.student_lastname.value = student.lastname
    let index = (student.gender=='male')?1:2
    form.student_gender.selectedIndex = index
    form.student_birthdate.value = student.birthdate
    form.student_age.value = student.age
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            Process('Editing please wait.')
            let students = JSON.parse(localStorage.getItem('enrollify_students'))
            let new_students = []
            students.forEach((item) => {
                if (item.id == student.id) {
                    item.lrn = form.student_lrn.value
                    item.firstname = form.student_firstname.value
                    item.middlename = form.student_middlename.value
                    item.lastname = form.student_lastname.value
                    item.gender = form.student_gender.value
                    item.birthdate = form.student_birthdate.value
                    item.age = parseInt(form.student_age.value)
                }
                new_students.push(item)
            })
            localStorage.setItem('enrollify_students', JSON.stringify(new_students))
            Success('Student was updated successfully.')
        }
        form.classList.add('was-validated')
    }, false)
}

function updateStudent(student) {
    let students = JSON.parse(localStorage.getItem('enrollify_students'))
    let new_students = []
    students.forEach((item) => {
        if (item.id == student.id) {
            item = student
        }
        new_students.push(item)
    })
    localStorage.setItem('enrollify_students', JSON.stringify(new_students))
}

function deleteStudent(data) {
    Swal.fire({
        icon: 'warning',
        iconColor: '#f3676e',
        iconHtml: '<i class="fa-solid fa-question"></i>',
        html: 'Are you sure you want to delete <b class="fw-bolder">'+data.firstname+' '+data.lastname+'</b>?',
        width: 350,
        padding: 20,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
        cancelButtonText: '<i class="fa-solid fa-times"></i> No',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn px-4 btn-danger bg-gradient me-2',
            cancelButton: 'btn px-4 btn-success bg-gradient',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            //delete students
            let students = JSON.parse(localStorage.getItem('enrollify_students'))//get students
            let newStudents = students.filter((student) => { return (student.id!=data.id) && student })
            localStorage.setItem('enrollify_students', JSON.stringify(newStudents))//save students
            // delete grades
            let grades = JSON.parse(localStorage.getItem('enrollify_grades'))//get grades
            let newGrades = grades.filter((g) => { return (g.student_id!=data.id) && g })
            localStorage.setItem('enrollify_grades', JSON.stringify(newGrades))//save grades
            // delete attendance
            let attendance = JSON.parse(localStorage.getItem('enrollify_attendance'))//get attendance
            let newAttendance = attendance.filter((a) => { return (g=a.student_id!=data.id) && a })
            localStorage.setItem('enrollify_attendance', JSON.stringify(newAttendance))//save attendance
            Process()
            Success('Student was deleted successfully.')
        }
    })
}

//functions for attendance

function getAttendance(student){
    let data = JSON.parse(localStorage.getItem('enrollify_attendance'))
    let a = null
    data.forEach((d) => {
        if(d.student_id == student.id){ a = d }
    })
    return (a)
}

//function for grades

function getGrades(id) {
    let data = JSON.parse(localStorage.getItem('enrollify_grades'))
    let a = []
    data.forEach((d) => {
        if (d.student_id == id) {
            a.push(d)
        }
    })
    return a
}

function checkQuarter(id, quarter) {
    let data = JSON.parse(localStorage.getItem('enrollify_grades'))
    let a = null
    data.forEach((d) => {
        if (d.student_id == id && d.quarter == quarter) {
            a = d
        }
    })
    return a
}

function addGrades(form, g) {
    new bootstrap.Modal(document.querySelector("#addGrades")).show() //show form

    let id = parseInt(localStorage.getItem('current_student'))

    if (g != undefined) {
        form.quarter.selectedIndex = g.quarter
        form.filipino.value = g.subjects.filipino
        form.english.value = g.subjects.english
        form.math.value = g.subjects.math
        form.arpan.value = g.subjects.arpan
        form.tle.value = g.subjects.tle
        form.music.value = g.subjects.music
        form.arts.value = g.subjects.arts
        form.pe.value = g.subjects.pe
        form.health.value = g.subjects.health
    }
    
    form.quarter.addEventListener('change', (e) => {
        let check = checkQuarter(id, e.target.value)
        if (check != null) {
            Swal.fire({
                icon: 'warning',
                title: 'Update!',
                iconColor: '#f3676e',
                html: 'Please note that this will update the quarter grades.',
                allowOutsideClick: false,
                showConfirmButton: false,
                width: 350,
                timer: 2000
            })
            form.filipino.value = check.subjects.filipino
            form.english.value = check.subjects.english
            form.math.value = check.subjects.math
            form.arpan.value = check.subjects.arpan
            form.tle.value = check.subjects.tle
            let mapeh = Math.round((check.subjects.music + check.subjects.arts + check.subjects.pe + check.subjects.health)/4)
            document.getElementById('mapeh').innerHTML = mapeh
            form.music.value = check.subjects.music
            form.arts.value = check.subjects.arts
            form.pe.value = check.subjects.pe
            form.health.value = check.subjects.health
        }
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            //create new grade set
            let quarter = parseInt(form.quarter.value) 
            let grades = {}
            grades.id = Date.now()
            grades.quarter = quarter
            grades.student_id = id
            grades.subjects = {}
            grades.subjects.filipino = Math.round(parseInt(form.filipino.value))
            grades.subjects.english = Math.round(parseInt(form.english.value))
            grades.subjects.math = Math.round(parseInt(form.math.value))
            grades.subjects.arpan = Math.round(parseInt(form.arpan.value))
            grades.subjects.tle = Math.round(parseInt(form.tle.value))
            grades.subjects.music = Math.round(parseInt(form.music.value))
            grades.subjects.arts = Math.round(parseInt(form.arts.value))
            grades.subjects.pe = Math.round(parseInt(form.pe.value))
            grades.subjects.health = Math.round(parseInt(form.health.value))
            //save the data
            let data = JSON.parse(localStorage.getItem('enrollify_grades'))
            if (checkQuarter(id, quarter) == null) {
                data.push(grades)
                Process('Adding please wait.')
            } else {
                let new_data = []
                data.forEach((d) => {
                    if (d.student_id == id && d.quarter == quarter) {
                        d = grades
                    }
                    new_data.push(d)
                })
                data = new_data
                Process('Updating please wait.')
            }
            localStorage.setItem('enrollify_grades', JSON.stringify(data)) //updates grades
            Success('Process completed!')
        }
        form.classList.add('was-validated')
    }, false)
}

function deleteGrade(id) {
    Swal.fire({
        icon: 'warning',
        iconColor: '#f3676e',
        iconHtml: '<i class="fa-solid fa-question"></i>',
        title: 'Delete?',
        html: 'Are you sure you want to delete this grades?',
        width: 350,
        padding: 20,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes',
        cancelButtonText: '<i class="fa-solid fa-times"></i> No',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn px-4 btn-danger bg-gradient me-2',
            cancelButton: 'btn px-4 btn-success bg-gradient',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            //delete grade
            let grades = JSON.parse(localStorage.getItem('enrollify_grades'))//get grades
            let newGrades = grades.filter((grade) => { return (grade.id != id) && grade })
            localStorage.setItem('enrollify_grades', JSON.stringify(newGrades))//save students
            Process()
            Success('Quarter was deleted successfully.')
        }
    })
}

//format functions
function formatName(name, format) {
    if (format == 'standard') {
        if (name.middlename != '') {
            return name.lastname + ' ' + name.firstname + ' ' + name.middlename[0] + '.'
        } else {
            return name.firstname + ' ' + name.lastname
        }
    } else if (format == 'normal') {
        if (name.middlename != '') {
            return name.firstname + ' ' + name.middlename[0] + '. ' + name.lastname
        } else {
            return name.firstname + ' ' + name.lastname
        }
    } else {
        if (name.middlename != '') {
            return name.firstname + ' ' + name.middlename + ' ' + name.lastname
        } else {
            return name.firstname + ' ' + name.lastname
        }
    }
}

function formatsectionName(section) {
    return 'Grade ' + section.level + ' ' + section.name
}

//tools

function addClasses(e, classes) {
    var classes = classes.split(' ')
    classes.forEach((c) => {
        e.classList.add(c)
    })
}

function createElement(e, content) {
    let a = document.createElement(e)
    if (content != undefined) {
        a.appendChild(document.createTextNode(content))
    }
    return a
}

//table functions
function createRow(tbody) {
    let row = document.createElement('tr')
    tbody.appendChild(row)
    return row
}
function insertCell(tr, content) {
    let cell = document.createElement('td')
    let text = document.createTextNode(content)
    cell.appendChild(text)
    tr.appendChild(cell)
    return cell
}
function createButton(cell, content, icon) {
    let button = document.createElement('button')
    if (icon) button.innerHTML = icon
    let text = document.createTextNode(content)
    button.appendChild(text)
    cell.appendChild(button)
    return button
}


//print function
function printPage(url){
    Process()
    let div = document.createElement('div');
        div.id = 'print-page'
        div.style.display = 'none'
    let template = '<div class="d-flex flex-column align-items-center justify-content-center w-100 h-100">'
            template = template.concat('<iframe height="100%" width="900" frameborder="0" id="page-frame" name="page-frame"></iframe>')
        template = template.concat('</div>')
    div.innerHTML = template;
    document.body.insertBefore(div, document.body.firstChild)
    var page = document.getElementById('page-frame')
    page.src = url
    page.addEventListener('load', function(){
        setTimeout(function(){
            Swal.close()
            page.contentWindow.print()
        }, 1000);
    }, true)
}