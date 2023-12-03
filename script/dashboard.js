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
            Redirect('../signin.html')
        }
    })
}

function Process(message = 'Processing please wait.', duration=3000) {
    let html;
    html = '<div style="min-height: 150px" class="d-flex flex-column align-items-center justify-content-center">'
    html = html.concat('<img style="width: 100%; max-width: 150px" src="assets/loading.gif">')
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

// function for users

function getUser(email, password) {
    let data = JSON.parse(localStorage.getItem('enrollify_users'))
    data.forEach((d) => {
        if (d.email == email && d.password == password) {
            data = d
        } else {
            data = null
        }
    })
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

// function for sections

function getSection() {
    let id = parseInt(localStorage.getItem('current_section'))
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
    let id = parseInt(localStorage.getItem('current_user'))
    let data = JSON.parse(localStorage.getItem('enrollify_sections'))
    let a = []
    data.forEach((d) => {
        if (d.owner == id) {
            d.male = countMale(d.id)
            d.female = countFemale(d.id)
            d.total = d.male + d.female
            a.push(d)
        }
    })
    return a
}

function getStudents(section) {
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

function addSection(form) {
    let data = {}
    //set data
    data.owner = parseInt(localStorage.getItem('current_user'))
    data.name = form.name.value
    data.level = parseInt(form.level.value)
    data.id = Date.now()
    let section = JSON.parse(localStorage.getItem('enrollify_sections'))
    section.push(data)
    localStorage.setItem('enrollify_sections', JSON.stringify(section))
    Process('Adding please wait.')
    Success('Section was added successfully.')
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
                Success('section was updated successfully.')
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
            Success('section was deleted successfully.', 'sections.html')
        }
    })
}


//functions for students

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

function getStudentList(section) {
    let data = JSON.parse(localStorage.getItem('enrollify_students'))
    let list = []
    data.forEach((d) => {
        if(d.section == section) list.push(d)
    })
    return list
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
            // delete sttendance
            let attendance = JSON.parse(localStorage.getItem('enrollify_attendancec'))//get attendance
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

    let id = parseInt(localStorage.getItem('enrollify_current_student'))

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
                html: 'Please note that this will update the current quarter grades.',
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
            form.music.value = check.subjects.music
            form.arts.value = check.subjects.arts
            form.pe.value = check.subjects.pe
            form.health.value = check.subjects.health
        } else {
            form.filipino.value = ''
            form.english.value = ''
            form.math.value = ''
            form.arpan.value = ''
            form.tle.value = ''
            form.music.value = ''
            form.arts.value = ''
            form.pe.value = ''
            form.health.value = ''
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
        iconHtml: '<i class="fa-solid fa-trash"></i>',
        title: 'Delete?',
        html: 'Are you sure you want to delete this quarterly grades?',
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
            return name.lastname + ', ' + name.firstname + ' ' + name.middlename[0] + '.'
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