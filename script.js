const addTask = document.querySelector(".addTask")
const btn1 = document.querySelector(".btn1")
const btn2 = document.querySelector(".btn2")
const input = document.querySelector(".input")
const overlay = document.querySelector("#overlay")
const btnclose = document.querySelector("#close")
const createTaskInner = document.querySelector("#create-task-inner")
const emptyExt = document.querySelector(".empty-ext")
const emptyExt1 = document.querySelector(".empty-ext-1")
const pend_span = document.querySelector("#pend")
const comp_span = document.querySelector("#comp")
const tasks = document.querySelector(".tasks")
const overlayForm = document.querySelector("#overlay-form")
const emptyPending = document.querySelector(".empty-pending");
const pending = document.querySelector("#pending");
const notFound = document.querySelector("#not-found")
const topFound = document.querySelector("#top-found")





addTask.onclick = () => {
    addTask.classList.replace("addTask","btnClick")

    setTimeout(() => {
        addTask.classList.replace("btnClick","addTask")
    }, 100);
}

// btn1.onclick = () => {
//     btn1.classList.replace("btn1","btnChange")

//     setTimeout(() => {
//         btn1.classList.replace("btnChange","btn1")
//     }, 20);
// }

// btn2.onclick = () => {
//     btn2.classList.replace("btn2","btnChange")

//     setTimeout(() => {
//         btn2.classList.replace("btnChange","btn2")
//     }, 20);
// }

input.addEventListener("mouseenter", () => {
    input.classList.add("inputExtend");
});

input.addEventListener("mouseleave", () => {
    input.classList.remove("inputExtend");
});

//====================================================


let task_arr = JSON.parse(localStorage.getItem("tasks")) || []
let complete_arr = JSON.parse(localStorage.getItem("completetasks")) || []

let result_arr = []


let updateIndex = null;

let count2 = JSON.parse(localStorage.getItem("count2")) || 0;

let searchData = "";



function createTask() {
    if (createTaskInner.textContent == "Update") {
        createTaskInner.textContent = "Create"
    }

    overlay.style.display = "none"

    createCard()
    

    if (task_arr.length === 0) {
        emptyPending.style.display = "flex";
        emptyExt.appendChild(emptyPending);
        return;
    }
}



function createCard() {
    emptyExt.innerHTML = ""
    task_arr.forEach((obj) => {
        emptyExt.innerHTML += `<div class="task-card">
                            <div class="content">
                                <h3>${obj.title}</h3>
                                <p>${obj.description}</p>
                        
                                <span class="category">${obj.category}</span>
                            </div>
                        
                            <div class="actions">
                                <button onclick="updateTask('${obj.id}')" class="edit">
                                    <img src="/JS/JS-Main-Projects/Task Manager(DOM)/images/edit.svg" alt="">
                                </button>
                        
                                <button onclick="deleteTask('${obj.id}')" class="delete">
                                    <img src="/JS/JS-Main-Projects/Task Manager(DOM)/images/delete-1487.svg" alt="">
                                </button>

                                <button onclick="completeTask('${obj.id}')" class="complete">
                                    <img src="/JS/JS-Main-Projects/Task Manager(DOM)/images/complete.svg" alt="">
                                </button>
                            </div>
                        </div>`;
    })
}


function completeCard() {
    emptyExt1.innerHTML = ""
    complete_arr.forEach((obj) => {
        emptyExt1.innerHTML += `<div class="task-card">
                            <div class="content">
                                <h3>${obj.title}</h3>
                                <p>${obj.description}</p>
                        
                                <span class="category">${obj.category}</span>
                            </div>
                        </div>`;
    })
}




if(task_arr.length > 0){
    createCard()
}

if(complete_arr.length > 0){
    completeCard()
}

pend_span.textContent = `${task_arr.length}`
comp_span.textContent = `${count2}`


addTask.addEventListener("click", () => {
    overlay.style.display = "flex"
})

btnclose.addEventListener("click", () => {
    overlay.style.display = "none"
})



overlayForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let id = crypto.randomUUID()
    let title = e.target[0].value
    let description = e.target[1].value
    let category = e.target[2].value


    if(title.trim() === "" || description.trim() === "" || category.trim() === ""){
        alert("Please enter the fields")
        return
    }



    let obj = {
        id,
        title,
        description,
        category
    }

    if (updateIndex !== null) {
      task_arr[updateIndex] = obj;
      updateIndex = null;
      localStorage.setItem("tasks", JSON.stringify(task_arr));
    } else {
      task_arr.push(obj);
      localStorage.setItem("tasks", JSON.stringify(task_arr));
      pend_span.textContent = `${task_arr.length}`
      localStorage.setItem("count1", JSON.stringify(task_arr.length))
    }
    createTask()
    overlayForm.reset();
})


const updateTask = (id) => {
  overlay.style.display = "flex";
  let task = task_arr.find((elem) => elem.id === id);
  updateIndex = task_arr.findIndex((elem) => elem.id === id);

  createTaskInner.textContent = "Update"

  overlayForm[0].value = task.title;
  overlayForm[1].value = task.description;
  overlayForm[2].value = task.category;


};


const deleteTask = (id) => {
    task_arr = task_arr.filter((elem) => elem.id !== id)
    createCard()
    localStorage.setItem("tasks", JSON.stringify(task_arr));

    pend_span.textContent = `${task_arr.length}`
    localStorage.setItem("count1", JSON.stringify(task_arr.length))

    if (task_arr.length === 0) {
        emptyPending.style.display = "flex";
        emptyExt.appendChild(emptyPending);
        return;
    }
}


const completeTask = (id) => {

    let confirmation = confirm("Are you sure")
    

    if(confirmation){
        complete_task = task_arr.find((elem) => elem.id === id);
        task_arr = task_arr.filter((elem) => elem.id !== id);

        localStorage.setItem("tasks", JSON.stringify(task_arr));
        createCard();

        complete_arr.unshift(complete_task);
        localStorage.setItem("completetasks", JSON.stringify(complete_arr));
        completeCard();

        count2++;
        pend_span.textContent = `${task_arr.length}`;
        comp_span.textContent = `${count2}`;
        localStorage.setItem("count1", JSON.stringify(task_arr.length));
        localStorage.setItem("count2", JSON.stringify(count2));

        if (task_arr.length === 0) {
          emptyPending.style.display = "flex";
          emptyExt.appendChild(emptyPending);
          return;
        }
    }else{
        return
    }

    
}


// ==========================================================

function searchTask(search) {
    result_arr = task_arr.filter((obj) => 
        [obj.title, obj.description, obj.category].some((value) => 
            String(value).toLowerCase().includes(search)
        ));
    
    pend_span.textContent = `${result_arr.length}`

    if (result_arr.length === 0) {
        emptyExt.innerHTML = `<div style = "background-color: rgba(255, 0, 0, 0.13)"; class="empty-completed">
                            <h3 style="color: red;font-size: xx-large;">❌No tasks found</h3>
                        </div>`
        return;
    }

    showSearchTask()
}


function showSearchTask() {
        emptyExt.innerHTML = ""
        result_arr.forEach((elem) => {
            emptyExt.innerHTML += `<div class="task-card">
                            <div class="content">
                                <h3>${elem.title}</h3>
                                <p>${elem.description}</p>
                        
                                <span class="category">${elem.category}</span>
                            </div>
                        
                            <div class="actions">
                                <button onclick="updateTask('${elem.id}')" class="edit">
                                    <img src="https://www.svgrepo.com/show/503019/edit.svg" alt="">
                                </button>
                        
                                <button onclick="deleteTask('${elem.id}')" class="delete">
                                    <img src="https://www.svgrepo.com/show/511788/delete-1487.svg" alt="">
                                </button>

                                <button onclick="completeTask('${elem.id}')" class="complete">
                                    <img src="https://www.svgrepo.com/show/501519/complete.svg" alt="">
                                </button>
                            </div>
                        </div>`;
    })    
}

input.addEventListener("input", (e) => {
    e.preventDefault()
    searchData = e.target.value.trim()
    
    searchTask(searchData.toLowerCase())
})



