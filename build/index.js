"use strict";
// This project is aimed at developing a web-based and central Recruitment Process System for the HR Group for a company. Some features of this system will be creating vacancies, storing Applicants data, Interview process initiation, Scheduling Interviews, Storing Interview results for the applicant and finally Hiring of the applicant. Reports may be required to be generated for the use of HR group.
// import fs from 'fs';
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
class Vacancy {
    constructor(vacancyID, role, experience, qualification, description, opening) {
        this.vacancyID = vacancyID;
        this.role = role;
        this.experience = experience;
        this.qualification = qualification;
        this.description = description;
        this.opening = opening;
    }
}
class Applicant {
    constructor(id, name, email, contact, state, city, position) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.state = state;
        this.city = city;
        this.position = position;
    }
}
class Schedule {
    constructor(id, dateTime) {
        this.id = id;
        this.dateTime = dateTime;
    }
}
class HRMS {
    constructor() {
        this.vacancyData = [
            { "vacancyID": 1, "role": "Software Developer", "experience": "freshers", "qualification": "BE", "description": "DSA", "opening": 10 }
        ];
        this.interviewData = [];
        this.applicantsData = [];
        this.scheduledApplicantsData = [];
        this.hiredApplicantsData = [];
        this.vacancyID = 1;
        this.interviewNumber = 1;
        this.applicantsHeader = ["ID", "Name", "Email", "Contact", "State", "City", "Position"];
        this.scheduledApplicantsHeader = ["ID", "Name", "Email", "Contact", "State", "City", "Position", "Scheduled on"];
        this.hiredApplicantsHeader = ["ID", "Name", "Email", "Contact", "State", "City", "Position", "score", "comments", "pass"];
        this.vacancyHeader = ["ID", "Role", "Experience", "Qualification", "Descriptiotn", "Opening"];
    }
    createVacancies(role, experience, qualification, description, opening) {
        let vacancy = new Vacancy(this.vacancyID++, role, experience, qualification, description, opening);
        this.vacancyData.push(vacancy);
        this.displayVacancies();
    }
    loadTable(data, tableheads, targetTable, wantButton = false, hiredbtn = false) {
        let table = document.getElementById(targetTable);
        table.innerHTML = "";
        let thead = document.createElement("thead");
        let trh = document.createElement("tr");
        for (const value of tableheads) {
            let th = document.createElement("th");
            th.innerHTML = value;
            trh.appendChild(th);
        }
        ;
        thead.appendChild(trh);
        if (wantButton) {
            let forbtn = document.createElement("th");
            // forbtn.innerHTML = "Schedule";
            trh.appendChild(forbtn);
        }
        table.appendChild(thead);
        // appending data to body
        let tbody = document.createElement("tbody");
        if (data[0] === undefined) {
            return;
        }
        let allKeys = Object.keys(data[0]);
        for (let obj of data) {
            let row = document.createElement("tr");
            for (let key of allKeys) {
                let td = document.createElement("td");
                td.innerHTML = obj[key];
                row.appendChild(td);
            }
            // if we want button in table then wantButton need to be set as TRUE, default is False
            if (wantButton) {
                let button = document.createElement("td");
                if (hiredbtn) {
                    button.innerHTML = `<button type="button" class="btn btn-outline-primary" onclick="Review(${obj.id})">Review</button>`;
                }
                else {
                    button.innerHTML = `<button type="button" class="btn" onclick="SetInterview(${obj.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm-fill" viewBox="0 0 16 16">
                    <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zm2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
                  </svg></button>`;
                }
                row.appendChild(button);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }
    displayVacancies() {
        this.loadTable(this.vacancyData, this.vacancyHeader, "table", false);
    }
    fetchApplicantsData() {
        fetch('../applicants.json')
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(result => {
            let data = result["applicants"];
            this.applicantsData = data;
            this.loadTable(this.applicantsData, this.applicantsHeader, "applicantsTable", true);
        })
            .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });
    }
    scheduledApplicants() {
        this.loadTable(this.scheduledApplicantsData, this.scheduledApplicantsHeader, "scheduledApplicants", false);
    }
    scheduleInterview(id, dateobj) {
        let schedule = new Schedule(id, dateobj);
        this.interviewData.push(schedule);
        let idx = 0;
        this.applicantsData.forEach(e => {
            if (e.id === id) {
                let temp = e;
                temp["scheduled"] = dateobj;
                this.scheduledApplicantsData.push(temp);
                this.applicantsData.splice(idx, 1);
            }
            idx++;
        });
        // console.log(this.applicantsData);
        this.loadTable(this.applicantsData, this.applicantsHeader, "applicantsTable", true);
        this.loadTable(this.scheduledApplicantsData, this.scheduledApplicantsHeader, "scheduledApplicants", true, true);
    }
    hiredApplicants(id, score, comments, pass) {
        let idx = 0;
        this.scheduledApplicantsData.forEach((e) => {
            // console.log(e);
            if (e.id === id) {
                let temp = e;
                temp["score"] = score;
                temp["comments"] = comments;
                this.scheduledApplicantsData.splice(idx, 1);
                if (pass) {
                    this.hiredApplicantsData.push(temp);
                }
            }
            idx++;
        });
        this.loadTable(this.hiredApplicantsData, this.hiredApplicantsHeader, "hiredApplicants", false);
        this.loadTable(this.scheduledApplicantsData, this.scheduledApplicantsHeader, "scheduledApplicants", true, true);
    }
}
// Scheduling Interviews, Storing Interview results, hiring applicant
const hrms = new HRMS();
hrms.displayVacancies();
hrms.fetchApplicantsData();
hrms.scheduledApplicants();
hrms.hiredApplicants(-1, -1, "", false);
var myModal;
function create() {
    myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
    });
    myModal.show();
}
(_a = document.getElementById("createVac")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    let role = document.getElementById("role").value;
    let exp = document.getElementById("experience").value;
    let qualify = document.getElementById("qualification").value;
    let description = document.getElementById("description").value;
    let openings = document.getElementById("openings").value;
    // console.log(role,exp,qualify,description,openings);
    hrms.createVacancies(role, exp, qualify, description, Number(openings));
    myModal === null || myModal === void 0 ? void 0 : myModal.hide();
});
let scheduleModal;
let applicantID;
function SetInterview(obj) {
    scheduleModal = new bootstrap.Modal(document.getElementById("scheduleModal"), {
        keyboard: false
    });
    applicantID = obj;
    scheduleModal.show();
}
(_b = document.getElementById("scheduleit")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let dateobj = new Date(date + ' ' + time);
    let currDate = new Date();
    if (dateobj < currDate) {
        alert("Invalid Date/Time");
    }
    else {
        hrms.scheduleInterview(applicantID, dateobj);
    }
    scheduleModal.hide();
});
let reviewModal;
let reviewingID;
function Review(id) {
    reviewModal = new bootstrap.Modal(document.getElementById("reviewModal"), {
        keyboard: false
    });
    reviewingID = id;
    reviewModal.show();
}
(_c = document.getElementById("finalize")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    let score = Number(document.getElementById("score").value);
    let comments = document.getElementById("comments").value;
    let pass = document.getElementById("pass").checked;
    hrms.hiredApplicants(reviewingID, score, comments, pass);
    reviewModal.hide();
});
