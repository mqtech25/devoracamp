const currentDate = document.getElementById('currentDate');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const date = new Date();
const dateMonth = months[date.getMonth()];
const dateYear = date.getFullYear();
const dateDate = date.getDate();
const dateDateDays = days[date.getDay()];
 
currentDate.innerHTML= `${dateDateDays}, ${dateDate} ${dateMonth} ${dateYear}`;

const taskinputTodo = document.getElementById('taskinputTodo');
const addTask = document.getElementById('addTask');
const taskInputerror = document.getElementById('taskInputerror');
const taskCount = document.getElementById('taskCount');
const taskList = document.getElementById('taskList');

const filterBtn = document.querySelectorAll('.btn-filter');
const taskStatus = document.getElementById('taskStatus');


let localStoreArry= [{"taskListObjId":3126829120651280,"taskListObjTodo":"task1","taskListObjStatus":"active"},{"taskListObjId":4910990130186769,"taskListObjTodo":"task2","taskListObjStatus":"completed"},{"taskListObjId":6145658562635171,"taskListObjTodo":"task3","taskListObjStatus":"active"}];

let checkLocalStoreArry = null;

if(!localStorage.getItem('checkLocalStoreArry')){
    localStorage.setItem('taskArry',JSON.stringify(localStoreArry))
    localStorage.setItem('checkLocalStoreArry',true)
}

 
let taskArry = JSON.parse(localStorage.getItem('taskArry')) || [];

let editingTaskId = null;

randerTask();

 
addTask.addEventListener('click',function(e){
    e.preventDefault();
    if(!taskinputTodo.value){
    taskInputerror.innerHTML = "Task input required"
    }else{
        taskInputerror.innerHTML ="";
        let taskListObj = {
        taskListObjId:randomNumberGen(),
        taskListObjTodo:taskinputTodo.value,
        taskListObjStatus:"active"
    }
       
       taskArry.push(taskListObj)
localStorage.setItem('taskArry',JSON.stringify(taskArry));

        taskinputTodo.value =""
    }


 randerTask();
    
})


function editTask(e){
    const taskID = e.dataset.edittask
    const taskElem = document.getElementById(`task${taskID}`);

    editingTaskId = taskID;

    taskElem.setAttribute('contenteditable',true)
    taskElem.focus()

}

    taskList.addEventListener('keydown', function (e) {

    if (e.key === 'Enter' && e.target.hasAttribute('contenteditable')) {
        e.preventDefault();
        saveTaskEdit();
        e.target.setAttribute('contenteditable',false)
        editingTaskId = null;
    }
    });

    document.addEventListener('click', function (e) {

    if (!editingTaskId) return;

        const taskElemBarCheck = document.getElementById(`todo${editingTaskId}`)
        const taskElem = document.getElementById(`task${editingTaskId}`)

    // If click is outside the currently edited task
    if (taskElemBarCheck && !taskElemBarCheck.contains(e.target)  ) {
        e.preventDefault();
        saveTaskEdit();
        taskElem.setAttribute('contenteditable',false);
        editingTaskId = null;
        
    }

});

function saveTaskEdit(){
        
        const editingTaskIdElem = document.getElementById(`task${editingTaskId}`)

        const taskFiltered= taskArry.find(taskId=> taskId.taskListObjId === Number(editingTaskId))

           if(taskFiltered){
            taskFiltered.taskListObjTodo = editingTaskIdElem.innerText.trim();
            localStorage.setItem('taskArry',JSON.stringify(taskArry))
           }

        randerTask()
}

function deleteTask(e){
    
    const taskDelId = e.dataset.deletetask;
    
    const newtaskArry= taskArry.filter(task=>{
        return task.taskListObjId !== Number(taskDelId)
    })

    taskArry = newtaskArry;
     localStorage.setItem('taskArry',JSON.stringify(taskArry))
    randerTask();

    
}

function completeTask(e){
    
    const completeTaskID = e.dataset.completetaskid;

    const completeTaskFilter = taskArry.find(task=> task.taskListObjId === Number(completeTaskID))

        if(completeTaskFilter.taskListObjStatus == "completed"){
            completeTaskFilter.taskListObjStatus = "active";
        }else{
            completeTaskFilter.taskListObjStatus = "completed";
        }

         localStorage.setItem('taskArry',JSON.stringify(taskArry))

        randerTask()
}



function randerTask(){
       taskList.innerHTML =""

    if(taskArry){
        taskArry.forEach(function(val,i){
        taskList.innerHTML +=`
        <li class="todo-app-container-task-list-item" id="todo${val.taskListObjId}" data-status="${val.taskListObjStatus}">
                            <button type="button" class="checkBox" onclick="completeTask(this)" data-completeTaskID="${val.taskListObjId}">
                                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5L6.2 12L13 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </button>

                            <span class="todo-app-container-task-list-item-text" id="task${val.taskListObjId}">
                                ${val.taskListObjTodo}
                            </span>

                            <div class="todo-app-container-task-list-item-actions">
                                <button type="button" class="icon-btn edit" onclick="editTask(this)" data-editTask="${val.taskListObjId}" aria-label="Edit task"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3 2.3a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4L5.4 13H3v-2.4L11.3 2.3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"></path></svg></button>
                                
                                <button type="button" class="icon-btn delete" onclick="deleteTask(this)" data-deleteTask="${val.taskListObjId}" aria-label="Delete task"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4H13M6.5 4V2.8C6.5 2.36 6.86 2 7.3 2H8.7C9.14 2 9.5 2.36 9.5 2.8V4M12 4L11.5 13C11.46 13.55 11 14 10.4 14H5.6C5 14 4.54 13.55 4.5 13L4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div>

                        </li>`

        
    })

    const activeTask = taskArry.filter(task=> task.taskListObjStatus == "active");

    taskCount.innerHTML = activeTask.length;

    filterButtons();


    }
}

function filterButtons(){
    filterBtn.forEach(function(elem,i){
  if(elem.classList.contains('active')){
   elem.click();
   
  }

    elem.addEventListener('click',function(){
        const filterListStatus = this.dataset.filter
        const activeTaskList = taskList.querySelectorAll('.todo-app-container-task-list-item[data-status="active"]')
        const completedTaskList = taskList.querySelectorAll('.todo-app-container-task-list-item[data-status="completed"]')

        filterBtn.forEach(function(elem,i){
            elem.classList.remove('active');
        })
        this.classList.add('active')
        
        if(filterListStatus=="active"){
            completedTaskList.forEach(function(elem,i){
                elem.style.display ="none"
            })
               activeTaskList.forEach(function(elem,i){
                elem.style.display ="flex"
            })

            const checkTaskActiveEmpty = taskArry.filter(task=> task.taskListObjStatus == "active");

             if(!checkTaskActiveEmpty.length){
                taskStatus.querySelector('#empty').style.display = "block"
                taskStatus.querySelector('#complete').style.display = "none"
            }else{
                   taskStatus.querySelector('#empty').style.display = "none"
                taskStatus.querySelector('#complete').style.display = "none"
            }
            
        }else if(filterListStatus=="completed"){
             activeTaskList.forEach(function(elem,i){
                elem.style.display ="none"
            })
              completedTaskList.forEach(function(elem,i){
                elem.style.display ="flex"
            })
                const checkTaskCompeletEmpty = taskArry.filter(task=> task.taskListObjStatus == "completed");
            if(!checkTaskCompeletEmpty.length){
                
                 taskStatus.querySelector('#complete').style.display = "block"
                taskStatus.querySelector('#empty').style.display = "none"
            }else{
                
                   taskStatus.querySelector('#empty').style.display = "none"
                taskStatus.querySelector('#complete').style.display = "none"
            }

        }else if(elem.dataset.filter == "all"){
            
             activeTaskList.forEach(function(elem,i){
                elem.style.display ="flex"
            })
            completedTaskList.forEach(function(elem,i){
                elem.style.display ="flex"
            })

             if(!taskArry.length){
                taskStatus.querySelector('#empty').style.display = "block"
                taskStatus.querySelector('#complete').style.display = "none"
            } else{
                   taskStatus.querySelector('#empty').style.display = "none"
                taskStatus.querySelector('#complete').style.display = "none"
            }
        }
    })

    window.addEventListener('DOMContentLoaded',function(){
        const activeTaskList = taskList.querySelectorAll('.todo-app-container-task-list-item[data-status="active"]')
        const completedTaskList = taskList.querySelectorAll('.todo-app-container-task-list-item[data-status="completed"]')

            activeTaskList.forEach(function(elem,i){
                elem.style.display ="flex"
            })
            completedTaskList.forEach(function(elem,i){
                elem.style.display ="flex"
            })

             if(!taskArry.length){
                taskStatus.querySelector('#empty').style.display = "block"
                taskStatus.querySelector('#complete').style.display = "none"
            } else{
                   taskStatus.querySelector('#empty').style.display = "none"
                taskStatus.querySelector('#complete').style.display = "none"
            }
    })
    
})
}



const randomNum = new Set()

function randomNumberGen(){
    let number;

    do{
       number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    }while(randomNum.has(number));

    randomNum.add(number)

    return number
}
