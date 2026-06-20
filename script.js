const toggleBtn = document.getElementById("toggleBtn");
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");

toggleBtn.addEventListener("click", () => {

    sidebar.classList.toggle("hide");

    if(sidebar.classList.contains("hide")){

        main.style.marginLeft = "0";

    }else{

        main.style.marginLeft = "260px";

    }

});

let employees =
JSON.parse(localStorage.getItem("employees")) || [];
let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];
let leaves =
JSON.parse(localStorage.getItem("leaves")) || [];
let patients =
JSON.parse(localStorage.getItem("patients")) || [];

let departmentChart;


function addEmployee() {

    const name =
    document.getElementById("empName").value;

    const department =
    document.getElementById("empDepartment").value;

    const email =
    document.getElementById("empEmail").value;

    const salary =
    document.getElementById("empSalary").value;

    const status =
    document.getElementById("empStatus").value;

    const photo =
    document.getElementById("empPhoto").files[0];

    if (!name || !department || !email || !salary) {

        alert("Please fill all fields");
        return;

    }

    if(photo){

    const reader = new FileReader();

    reader.onload = function(e){

        employees.push({

            id:"EMP"+Date.now(),
            name,
            department,
            email,
            salary,
            status,
            photo:e.target.result

        });

        saveData();
    }

    reader.readAsDataURL(photo);

}else{

    employees.push({

        id:"EMP"+Date.now(),
        name,
        department,
        email,
        salary,
        status,
        photo:""

    });

    saveData();
}

    document.getElementById("empName").value = "";
    document.getElementById("empDepartment").value = "";
    document.getElementById("empEmail").value = "";
    document.getElementById("empSalary").value = "";
}
document.getElementById("empStatus").value = "Active";

function saveData() {

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

    displayEmployees();
    updateDashboard();
    updateChart();
}

function displayEmployees() {

    const table =
    document.getElementById("employeeTable");

    table.innerHTML = "";

    employees.forEach((emp, index) => {

        let statusClass = "";

        if (emp.status === "Active")
            statusClass = "status-active";

        if (emp.status === "On Leave")
            statusClass = "status-leave";

        if (emp.status === "Inactive")
            statusClass = "status-inactive";

        table.innerHTML += `

        <tr>

            <td>${emp.id}</td>
            <td><imgsrc="${emp.photo || 'https://via.placeholder.com/40'}"class="emp-img"></td>

            <td>${emp.name}</td>

            <td>${emp.department}</td>

            <td>${emp.email}</td>

            <td>₹${emp.salary}</td>

            <td>
                <span class="${statusClass}">
                    ${emp.status}
                </span>
            </td>

            <td>

                <button
                class="edit-btn"
                onclick="editEmployee(${index})">
                Edit
                </button>

                <button
                class="delete-btn"
                onclick="deleteEmployee('${emp.id}')">
                Delete
                </button>

            </td>

        </tr>

        `;
    });

}

function editEmployee(index) {

    const emp = employees[index];

    document.getElementById("empName").value =
    emp.name;

    document.getElementById("empDepartment").value =
    emp.department;

    document.getElementById("empEmail").value =
    emp.email;

    document.getElementById("empSalary").value =
    emp.salary;

    document.getElementById("empStatus").value =
    emp.status;

    employees.splice(index, 1);

    saveData();
}

function deleteEmployee(id) {

    employees =
    employees.filter(emp => emp.id !== id);

    saveData();
}

function searchEmployee() {

    const value =
    document.getElementById("searchEmployee")
    .value
    .toLowerCase();

    const rows =
    document.querySelectorAll("#employeeTable tr");

    rows.forEach(row => {

        row.style.display =
        row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });
}

function updateDashboard() {

    document.getElementById("totalEmployees")
    .textContent = employees.length;

    document.getElementById("activeEmployees")
    .textContent =
    employees.filter(
        emp => emp.status === "Active"
    ).length;

    document.getElementById("leaveEmployees")
    .textContent =
    employees.filter(
        emp => emp.status === "On Leave"
    ).length;

    const departments =
    [...new Set(
        employees.map(
            emp => emp.department
        )
    )];

    document.getElementById("departments")
    .textContent = departments.length;
}

function updateChart() {

    const departments = {};

    employees.forEach(emp => {

        departments[emp.department] =
        (departments[emp.department] || 0) + 1;

    });

    const labels =
    Object.keys(departments);

    const data =
    Object.values(departments);

    const canvas =
document.getElementById("departmentChart");

if (!canvas) return;

const ctx = canvas.getContext("2d");

    if(departmentChart){
        departmentChart.destroy();
    }

    departmentChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: "Employees",

                data: data,

                backgroundColor:
                "#14b8a6"

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });

}
function markAttendance() {

    const name =
    document.getElementById(
        "attendanceName"
    ).value;

    const status =
    document.getElementById(
        "attendanceStatus"
    ).value;

    if(!name){
        alert("Enter employee name");
        return;
    }

    attendance.push({
        name,
        status
    });

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    displayAttendance();

    document.getElementById(
        "attendanceName"
    ).value = "";
}
function displayAttendance(){

    const table =
    document.getElementById(
        "attendanceTable"
    );

    table.innerHTML = "";

    attendance.forEach(item => {

        table.innerHTML += `

        <tr>

            <td>${item.name}</td>

            <td>${item.status}</td>

        </tr>

        `;

    });

}
function addLeave(){

    const employee =
    document.getElementById("leaveEmployee").value;

    const date =
    document.getElementById("leaveDate").value;

    const type =
    document.getElementById("leaveType").value;

    if(!employee || !date){
        alert("Fill all fields");
        return;
    }

    leaves.push({
        employee,
        date,
        type
    });

    localStorage.setItem(
        "leaves",
        JSON.stringify(leaves)
    );

    displayLeaves();

    document.getElementById("leaveEmployee").value="";
    document.getElementById("leaveDate").value="";
}

function displayLeaves(){

    const table =
    document.getElementById("leaveTable");

    table.innerHTML="";

    leaves.forEach((leave,index)=>{

        table.innerHTML += `

        <tr>

            <td>${leave.employee}</td>

            <td>${leave.date}</td>

            <td>${leave.type}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteLeave(${index})">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

}

function deleteLeave(index){

    leaves.splice(index,1);

    localStorage.setItem(
        "leaves",
        JSON.stringify(leaves)
    );

    displayLeaves();
}
displayEmployees();
updateDashboard();
displayAttendance();
displayLeaves();
updateChart();
function exportCSV(){

    let csv =
    "ID,Name,Department,Email,Salary,Status\n";

    employees.forEach(emp => {

        csv +=
        `${emp.id},
        ${emp.name},
        ${emp.department},
        ${emp.email},
        ${emp.salary},
        ${emp.status}\n`;

    });

    const blob =
    new Blob([csv],
    {type:"text/csv"});

    const url =
    window.URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "employees.csv";

    a.click();

    window.URL.revokeObjectURL(url);
}
function logout(){

    sessionStorage.removeItem(
        "loggedIn"
    );

    window.location.href =
    "login.html";
}
const themeBtn =
document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle(
        "dark-mode"
    );

    localStorage.setItem(
        "theme",
        document.body.classList.contains(
            "dark-mode"
        )
    );

});

if(
    localStorage.getItem("theme")
    === "true"
){
    document.body.classList.add(
        "dark-mode"
    );
}
function addPatient(){

    const name =
    document.getElementById(
        "patientName"
    ).value;

    const age =
    document.getElementById(
        "patientAge"
    ).value;

    const disease =
    document.getElementById(
        "patientDisease"
    ).value;

    const doctor =
    document.getElementById(
        "patientDoctor"
    ).value;

    const appointment =
    document.getElementById(
        "appointmentDate"
    ).value;

    if(
        !name ||
        !age ||
        !disease ||
        !appointment
    ){
        alert("Fill all fields");
        return;
    }

    patients.push({

        id:"PAT"+Date.now(),

        name,

        age,

        disease,

        doctor,

        appointment

    });

    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );

    displayPatients();

    document.getElementById(
        "patientName"
    ).value = "";

    document.getElementById(
        "patientAge"
    ).value = "";

    document.getElementById(
        "patientDisease"
    ).value = "";

    document.getElementById(
        "appointmentDate"
    ).value = "";
}
function displayPatients(){

    const table =
    document.getElementById(
        "patientTable"
    );

    table.innerHTML = "";

    patients.forEach(patient => {

        table.innerHTML += `

        <tr>

            <td>${patient.id}</td>

            <td>${patient.name}</td>

            <td>${patient.age}</td>

            <td>${patient.disease}</td>

            <td>${patient.doctor}</td>

            <td>${patient.appointment}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deletePatient('${patient.id}')">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

}
function deletePatient(id){

    patients =
    patients.filter(
        patient =>
        patient.id !== id
    );

    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );

    displayPatients();
}
function updatePatientDashboard(){

    document.getElementById(
        "totalPatients"
    ).textContent =
    patients.length;

}
displayPatients();
updatePatientDashboard();
function searchPatient(){

    const value =
    document
    .getElementById("searchPatient")
    .value
    .toLowerCase();

    const rows =
    document.querySelectorAll(
        "#patientTable tr"
    );

    rows.forEach(row => {

        row.style.display =
        row.innerText
        .toLowerCase()
        .includes(value)
        ? ""
        : "none";

    });

}
function showSection(sectionId){

    document
    .querySelectorAll(".section")
    .forEach(section => {

        section.classList.remove(
            "active"
        );

    });

    document
    .getElementById(sectionId)
    .classList.add("active");

}