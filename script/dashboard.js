//check if user is signed in
function checkAuth(){
    let id = localStorage.getItem('gz_current_user')
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
    let id = localStorage.getItem('gz_current_user')
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
        iconHtml: '<i class="fa-solid fa-right-from-bracket"></i>',
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
            localStorage.removeItem('gz_current_user')
            Redirect('signin.html')
        }
    })
}

function Process(message='Processing please wait.') {
    let html;
    html = '<div style="min-height: 200px" class="d-flex flex-column align-items-center justify-content-center gap-4">'
    html = html.concat('<img style="width: 50px" src="assets/spinner.gif">')
    html = html.concat(message)
    html = html.concat('</div>')
    Swal.fire({
        html: html,
        allowOutsideClick: false,
        showConfirmButton: false,
        width: 350,
        padding: 20,
        timer: 2000
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
    let data = JSON.parse(localStorage.getItem('gz_users'))
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
    let id = localStorage.getItem('gz_current_user')
    let data = JSON.parse(localStorage.getItem('gz_users'))
    let a = {}
    data.forEach((d) => {
       (d.id == id) && (a = d)
    })
    return a
}

// function for advisory

function getAdvisory(id) {
    let data = JSON.parse(localStorage.getItem('gz_advisory'))
    let a = {}
    data.forEach((d) => {
        if (d.id == id) {
            a = d
        }
    })
    return a
}

function getAdvisories() {
    let id = parseInt(localStorage.getItem('gz_current_user'))
    let data = JSON.parse(localStorage.getItem('gz_advisory'))
    let a = []
    data.forEach((d) => {
        if (d.owner == id) a.push(d)
    })
    return a
}

function getStudents() {
    let id = parseInt(localStorage.getItem('gz_current_user'))
    let advisories = getAdvisories(id)
    let data = []
    //get students
    let students = JSON.parse(localStorage.getItem('gz_students'))
    advisories.forEach((advisory) => {
        students.forEach((student) => {
            if(advisory.id == student.advisory) data.push(student)
        })
    })
    return data
}

function getAdvisoryList(owner) {
    let data = JSON.parse(localStorage.getItem('gz_advisory'))
    let list = []
    data.forEach((d) => {
        if (d.owner == owner) {
            d.male = countMale(d.id)
            d.female = countFemale(d.id)
            d.total = d.male + d.female
            list.push(d)
        }
    })
    return list
}

function countMale(id) {
    let data = JSON.parse(localStorage.getItem('gz_students'))
    let a = []
    data.forEach((d) => {
        if (d.advisory == id && d.gender == 'male') {
            a.push(d)
        }
    })
    return a.length
}

function countFemale(id) {
    let data = JSON.parse(localStorage.getItem('gz_students'))
    let a = []
    data.forEach((d) => {
        if (d.advisory == id && d.gender == 'female') {
            a.push(d)
        }
    })
    return a.length
}

function addAdvisory(form) {
    let data = {}
    //set data
    data.owner = parseInt(localStorage.getItem('gz_current_user'))
    data.name = form.name.value
    data.level = parseInt(form.level.value)
    data.id = Date.now()
    let advisory = JSON.parse(localStorage.getItem('gz_advisory'))
    advisory.push(data)
    localStorage.setItem('gz_advisory', JSON.stringify(advisory))
    Process()
    Success('Advisory was added successfully.')
}

function editAdvisory(form, advisory) {
    new bootstrap.Modal(document.querySelector("#editAdvisory")).show() //show form
    form.advisory_id.value = advisory.id
    form.advisory_name.value = advisory.name
    let index = 0
    index = (advisory.level == 7) ? 1 : index
    index = (advisory.level == 8) ? 2 : index
    index = (advisory.level == 9) ? 3 : index
    index = (advisory.level == 10) ? 4 : index
    form.advisory_level.selectedIndex = index
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            e.stopPropagation()
        } else {
            Process('Editing please wait.')
            {
                let advisories = JSON.parse(localStorage.getItem('gz_advisory'))
                let new_advisories = []
                advisories.forEach((item) => {
                    if (item.id == advisory.id) {
                        item.name = form.advisory_name.value
                        item.level = parseInt(form.advisory_level.value)
                    }
                    new_advisories.push(item)
                })
                localStorage.setItem('gz_advisory', JSON.stringify(new_advisories))
                Success('Advisory was updated successfully.')
            }
        }
        form.classList.add('was-validated')
    }, false)
}

function deleteAdvisory(advisory) {
    Swal.fire({
        icon: 'error',
        iconHtml: '<i class="fa-solid fa-trash"></i>',
        html: 'Are you sure you want to delete <b class="fw-bolder">Grade '+advisory.level+' '+advisory.name+'</b>?',
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
            let data = JSON.parse(localStorage.getItem('gz_advisory'))
            let new_data = []
            data.forEach((d) => {
                return (d.id!=advisory.id) && new_data.push(d)
            })
            localStorage.setItem('gz_advisory', JSON.stringify(new_data))//update advisory
            //delete all students inside the advisory
            new_data = []
            data = JSON.parse(localStorage.getItem('gz_students'))
            data.forEach((d) => {
                return (d.advisory!=advisory.id) && new_data.push(d)
            })
            localStorage.setItem('gz_students', JSON.stringify(new_data))//update students
            Success('Advisory was deleted successfully.', 'db-advisory.html')
        }
    })
}


//functions for students

function getStudent(id) {
    let data = JSON.parse(localStorage.getItem('gz_students'))
    let a = {}
    data.forEach((d) => {
        if (d.id == id) {
            a = d
        }
    })
    return a
}

function getStudentList(advisory) {
    let data = JSON.parse(localStorage.getItem('gz_students'))
    let list = []
    data.forEach((d) => {
        if(d.advisory == advisory) list.push(d)
    })
    return list
}

function addStudent(form) {
    let data = {}
    let id = Date.now()
    let advisory = localStorage.getItem('gz_current_advisory')
    //set data
    data.id = parseInt(id)
    data.advisory = parseInt(advisory)
    data.lrn = form.lrn.value
    data.firstname = form.firstname.value
    data.middlename = form.middlename.value
    data.lastname = form.lastname.value
    data.gender = form.gender.value
    data.age = parseInt(form.age.value)
    data.birthdate = form.birthdate.value
    let students = localStorage.getItem('gz_students')
    students = JSON.parse(students)
    students.push(data)
    localStorage.setItem('gz_students', JSON.stringify(students))
    Process()
    Success('Student was added successfully.')
}

function editStudent(form, student) {
    new bootstrap.Modal(document.querySelector("#editStudent")).show() //show form
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
            let students = JSON.parse(localStorage.getItem('gz_students'))
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
            localStorage.setItem('gz_students', JSON.stringify(new_students))
            Success('Student was updated successfully.')
        }
        form.classList.add('was-validated')
    }, false)
}

function deleteStudent(data) {
    Swal.fire({
        icon: 'warning',
        iconHtml: '<i class="fa-solid fa-trash"></i>',
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
            let students = JSON.parse(localStorage.getItem('gz_students'))//get students
            let newStudents = students.filter((student) => { return (student.id!=data.id) && student })
            localStorage.setItem('gz_students', JSON.stringify(newStudents))//save students
            // delete grades
            let grades = JSON.parse(localStorage.getItem('gz_grades'))//get grades
            let newGrades = grades.filter((g) => { return (g.student_id!=data.id) && g })
            localStorage.setItem('gz_grades', JSON.stringify(newGrades))//save grades
            Process()
            Success('Student was deleted successfully.')
        }
    })
}

//function for grades

function getGrades(id) {
    let data = JSON.parse(localStorage.getItem('gz_grades'))
    let a = []
    data.forEach((d) => {
        if (d.student_id == id) {
            a.push(d)
        }
    })
    return a
}

function checkQuarter(id, quarter) {
    let data = JSON.parse(localStorage.getItem('gz_grades'))
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

    let id = parseInt(localStorage.getItem('gz_current_student'))

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
            let data = JSON.parse(localStorage.getItem('gz_grades'))
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
            localStorage.setItem('gz_grades', JSON.stringify(data)) //updates grades
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
            let grades = JSON.parse(localStorage.getItem('gz_grades'))//get grades
            let newGrades = grades.filter((grade) => { return (grade.id != id) && grade })
            localStorage.setItem('gz_grades', JSON.stringify(newGrades))//save students
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

function formatAdvisoryName(advisory) {
    return 'Grade ' + advisory.level + ' ' + advisory.name
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