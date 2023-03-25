// This project is aimed at developing a web-based and central Recruitment Process System for the HR Group for a company. Some features of this system will be creating vacancies, storing Applicants data, Interview process initiation, Scheduling Interviews, Storing Interview results for the applicant and finally Hiring of the applicant. Reports may be required to be generated for the use of HR group.
// import fs from 'fs';

import { ApplyCodeActionCommandResult, couldStartTrivia } from "typescript";

// import { couldStartTrivia } from 'typescript';
declare var bootstrap: any;



// [{role,exp,qualify,description,opening}]

interface vacancyData{
    vacancyID: number,
    role:string,
    experience:string,
    qualification:string,
    description:string,
    opening: number
}
class Vacancy implements vacancyData{

    public constructor(public vacancyID:number,public role:string,public experience:string, public qualification:string, public description:string, public opening:number){

    }
}

interface applicant{
    id:number,
    name:string,
    email:string,
    contact:string,
    state:string,
    city:string
    position:string,
}

class Applicant implements applicant{

    public constructor(public id:number,public name:string,public email:string,public contact:string,public state:string,public city:string, public position:string){

    }
}

interface interviewer{
    id:number,
    name:string,
    position:string

}


interface allInterviewData{
    InterviewerID:number,
    at10am:boolean,
    at1pm:boolean,
    at4pm:boolean
}

interface scheduledApplicants extends applicant{
    scheduled:Date
}

interface hiredApplicant extends applicant{
    score:number,
    comments:string,
    pass:boolean
}

class Schedule{
    public constructor(public id:number, public dateTime:Date){

    }
}

class HRMS{

    public vacancyData: Vacancy[] = [
        {"vacancyID":1,"role":"Software Developer","experience":"freshers","qualification":"BE","description":"DSA","opening":10}
    ];
    public interviewData:Schedule[] = [];

    public applicantsData:applicant[] = [];
    public scheduledApplicantsData:scheduledApplicants[] = [];
    public hiredApplicantsData:hiredApplicant[] = [];

    vacancyID:number = 1;
    interviewNumber:number = 1;


    public applicantsHeader:string[] = ["ID","Name","Email","Contact","State","City","Position"];
    public scheduledApplicantsHeader:string[] = ["ID","Name","Email","Contact","State","City","Position","Scheduled on"];
    public hiredApplicantsHeader:string[] = ["ID","Name","Email","Contact","State","City","Position","score","comments","pass"];
    public vacancyHeader:string[] = ["ID","Role","Experience","Qualification","Descriptiotn","Opening"];

    public createVacancies(role:string,experience:string,qualification:string,description:string,opening:number){
        let vacancy:Vacancy = new Vacancy(this.vacancyID++,role,experience,qualification,description,opening)
        this.vacancyData.push(vacancy);
        this.displayVacancies();

    }


    public loadTable(data:any[],tableheads:string[],targetTable:string,wantButton:boolean=false,hiredbtn:boolean=false){
        let table:HTMLTableElement = document.getElementById(targetTable) as HTMLTableElement;
        table.innerHTML = "";
        let thead = document.createElement("thead");

        let trh = document.createElement("tr");

        for (const value of tableheads) 
        {
            let th = document.createElement("th");
            th.innerHTML = value;
            trh.appendChild(th);
        };
        thead.appendChild(trh);
        if(wantButton){
            let forbtn = document.createElement("th");
            // forbtn.innerHTML = "Schedule";
            trh.appendChild(forbtn);
        }
        table.appendChild(thead);


        // appending data to body
        let tbody = document.createElement("tbody");
        if(data[0]===undefined){
            return;
        }
        let allKeys:string[] = Object.keys(data[0]);

        for(let obj of data){
            let row = document.createElement("tr");

            for(let key of allKeys){
                let td = document.createElement("td");
                td.innerHTML = obj[key];
                row.appendChild(td);
            }

            // if we want button in table then wantButton need to be set as TRUE, default is False
            if(wantButton){
                let button = document.createElement("td");
                if(hiredbtn){
                    button.innerHTML = `<button type="button" class="btn btn-outline-primary" onclick="Review(${obj.id})">Review</button>`;
                }
                else{
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

    public displayVacancies(){
        this.loadTable(this.vacancyData,this.vacancyHeader,"table",false);
    }


    public fetchApplicantsData(){
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
            this.loadTable(this.applicantsData,this.applicantsHeader,"applicantsTable",true);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        });

    }

    public scheduledApplicants(){
        this.loadTable(this.scheduledApplicantsData,this.scheduledApplicantsHeader,"scheduledApplicants",false);
    }

    public scheduleInterview(id:number,dateobj:Date){
        let schedule:Schedule = new Schedule(id,dateobj);
        this.interviewData.push(schedule);
        
        let idx = 0;
        this.applicantsData.forEach(e => {
            if(e.id ===id){
                let temp:any = e;
                temp["scheduled"] = dateobj;
                this.scheduledApplicantsData.push(temp);
                this.applicantsData.splice(idx,1);
            }
            idx++;
        });
        // console.log(this.applicantsData);
        this.loadTable(this.applicantsData,this.applicantsHeader,"applicantsTable",true);
        this.loadTable(this.scheduledApplicantsData,this.scheduledApplicantsHeader,"scheduledApplicants",true,true)
    }

    public hiredApplicants(id:number,score:number,comments:string,pass:boolean){

        let idx = 0;
        this.scheduledApplicantsData.forEach((e: any) => {
            // console.log(e);
            if(e.id===id){
                let temp:any = e;
                temp["score"] = score;
                temp["comments"] = comments;
                this.scheduledApplicantsData.splice(idx,1);
                if(pass){
                    this.hiredApplicantsData.push(temp); 
                }
            }
            idx++;
        });
        this.loadTable(this.hiredApplicantsData,this.hiredApplicantsHeader,"hiredApplicants",false);
        this.loadTable(this.scheduledApplicantsData,this.scheduledApplicantsHeader,"scheduledApplicants",true,true)

    }
}
// Scheduling Interviews, Storing Interview results, hiring applicant

const hrms = new HRMS();
hrms.displayVacancies();
hrms.fetchApplicantsData();
hrms.scheduledApplicants();
hrms.hiredApplicants(-1,-1,"",false);

var myModal:any;
function create(){
    myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
    })
    myModal.show();
}
document.getElementById("createVac")?.addEventListener("click",()=>{
    let role = (document.getElementById("role") as HTMLInputElement).value;
    let exp = (document.getElementById("experience") as HTMLInputElement).value;
    let qualify  = (document.getElementById("qualification") as HTMLInputElement).value;
    let description = (document.getElementById("description") as HTMLInputElement).value;
    let openings = (document.getElementById("openings") as HTMLInputElement).value;
    // console.log(role,exp,qualify,description,openings);
    hrms.createVacancies(role,exp,qualify,description,Number(openings));
    myModal?.hide();
});

let scheduleModal:any;
let applicantID: number;
function SetInterview(obj:number){
    scheduleModal = new bootstrap.Modal(document.getElementById("scheduleModal"),{
        keyboard:false
    });
    applicantID = obj;
    scheduleModal.show();
}

document.getElementById("scheduleit")?.addEventListener("click",()=>{

    let date:string = (document.getElementById("date") as HTMLInputElement).value;
    let time:string = (document.getElementById("time") as HTMLInputElement).value;
    
    let dateobj = new Date(date +' '+ time);
    let currDate = new Date();

    if(dateobj<currDate){
        alert("Invalid Date/Time");
    }
    else{
        hrms.scheduleInterview(applicantID,dateobj);
    }
    scheduleModal.hide();
})


let reviewModal:any;
let reviewingID:number;
function Review(id:number){
    reviewModal = new bootstrap.Modal(document.getElementById("reviewModal"),{
        keyboard:false
    });
    reviewingID = id;
    reviewModal.show();
}

document.getElementById("finalize")?.addEventListener("click",()=>{

    let score:number = Number((document.getElementById("score") as HTMLInputElement).value);
    let comments:string = (document.getElementById("comments") as HTMLInputElement).value;
    let pass:boolean = (document.getElementById("pass") as HTMLInputElement).checked;
    
    hrms.hiredApplicants(reviewingID,score,comments,pass);
    reviewModal.hide();
})