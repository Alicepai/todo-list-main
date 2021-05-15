const form = document.querySelector("form");
const input = document.querySelector(".input");
const todoList = document.querySelector(".todo-list ul");
const todonum = document.querySelector('#item_count');
const allbtn = document.querySelector("#allbtn");
const activebtn = document.querySelector('#activebtn');
const completed = document.querySelector('#completebtn');
const clearall = document.querySelector('#clearcombtn');
const icons = document.querySelector(".icons");
const sunIcon = document.querySelector(".sun");
const moonIcon = document.querySelector(".moon");
const header = document.querySelector('.header');
const options = document.querySelectorAll(".options");
const body = document.body;
let data = JSON.parse(localStorage.getItem('todos')) || [];
let bgIsLight= JSON.parse(localStorage.getItem('bgIsLight')) || '';

function addTodo(e) {
    e.preventDefault();
    const inputValue = input.value.trim();
    if (inputValue) {
        data.push(
            {
                name: inputValue,
                id: Math.floor(Math.random() * 10000 + 1),
                done: false
            }
        );
        localStorage.setItem('todos', JSON.stringify(data));
        input.value = '';
        renderPage(data);
        allbtn.style.color=`${bgIsLight?'#000':'#fff'}`;
        activebtn.style.color = '';
        completed.style.color = '';
    }
}

function removeTodo(id) {
    let newIndex = 0;
    data.forEach((todo, index) => {
        if (id == todo.id) {
            newIndex = index;
        }
    })
    data.splice(newIndex, 1);
    localStorage.setItem('todos', JSON.stringify(data));
    renderPage(data);
}

function editInline(id) {
    let newIndex = 0;
    data.forEach((todo, index) => {
        if (id == todo.id) {
            newIndex = index;
        }
    })
    const NameInput = document.querySelectorAll(".todo p")[newIndex];
    NameInput.onclick = function () {
        NameInput.setAttribute("contenteditable", "true");
        // NameInput.classList.add("edit")
    }
    NameInput.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            var newName = NameInput.innerHTML;
            data[newIndex].name = newName;
            console.log(data);
            localStorage.setItem('todos', JSON.stringify(data));
            NameInput.setAttribute("contenteditable", "false");
            // NameInput.classList.remove("edit")
        }
    })
    NameInput.addEventListener('blur', () => {
            var newName = NameInput.innerHTML;
            data[newIndex].name = newName;
            console.log(data);
            localStorage.setItem('todos', JSON.stringify(data));
            NameInput.setAttribute("contenteditable", "false");
            // NameInput.classList.remove("edit")
    })
}

function manageStatus(id) {
    data.forEach((todo) => {
        if (id == todo.id) {
            todo.done = !todo.done;
        }
    })
    localStorage.setItem('todos', JSON.stringify(data));
    renderPage(data)
}

function judgeAction(e) {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (action === 'complete') {
        manageStatus(id);
    } else if (action === 'remove') {
        removeTodo(id)
    } else if (action === 'edit') {
        editInline(id)
    }
}

function filterCompleted(){
    let completeTodo = data.filter((todo)=>{
        if(todo.done){return todo}
    })
    allbtn.style.color='';
    activebtn.style.color = '';
    completed.style.color = `${bgIsLight?'#000':'#fff'}`;
    renderPage(completeTodo);
}
function showIncomplete(){
    let completeTodo = data.filter((todo)=>{
        if(!todo.done){return todo}
    })
    allbtn.style.color='';
    completed.style.color = '';
    activebtn.style.color = `${bgIsLight?'#000':'#fff'}`;
    renderPage(completeTodo);
}
function deleteCompleted(){
    let notCompleteTodo = data.filter((todo)=>{
        if(!todo.done){return todo}
    })
    data = notCompleteTodo;
    localStorage.setItem('todos', JSON.stringify(data));


    allbtn.style.color = '';
    activebtn.style.color = '';
    completed.style.color = '';

    renderPage(data);
}
function toggleBg(){
    if(!bgIsLight){
        bgIsLight = 'light';
        localStorage.setItem('bgIsLight',JSON.stringify(bgIsLight));
        body.classList.add("light");
        header.style.backgroundImage = `url('./images/bg-desktop-light.jpg')`;
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';

    }else{
        bgIsLight = '';
        localStorage.setItem('bgIsLight',JSON.stringify(bgIsLight));    
        body.classList.remove("light");
        header.style.backgroundImage = `url(./images/bg-desktop-dark.jpg)`;
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block'; 
    }
}

const theme = JSON.parse(localStorage.getItem('bgIsLight'))?JSON.parse(localStorage.getItem('bgIsLight')):'';
body.className = `${theme}`;
if(theme == 'light'){
    header.style.backgroundImage = `url('./images/bg-desktop-light.jpg')`;
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
}else{
    header.style.backgroundImage = `url(./images/bg-desktop-dark.jpg)`;
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block'; 

}

function renderPage(data) {
    
    let str = '';
    data.forEach((todo) => {
        str += `            
        <li class="todo">
        <button type="button" class="check ${todo.done?'show':''}" data-action="complete" data-id=${todo.id}></button>
        <div class="todo-row">
          <p contenteditable="false" class="${todo.done?'show':''}"  data-action="edit" data-id=${todo.id}>${todo.name}</p>
          <i id="delbtn" class="fas fa-times delbtn" data-action="remove" data-id=${todo.id}></i>
        </div>
      </li>`
    })
    if(data.length){
        todoList.innerHTML = str;
    }else{
        todoList.innerHTML = `<img src="./images/no_todo.gif" alt="">`;
    }
    todonum.innerHTML = data.length;

}
renderPage(data);


form.addEventListener('submit', addTodo)
todoList.addEventListener('click', judgeAction);
activebtn.addEventListener('click',showIncomplete)
completed.addEventListener('click',filterCompleted);
clearall.addEventListener('click',deleteCompleted);
icons.addEventListener('click',toggleBg);
allbtn.addEventListener('click',()=>{
    allbtn.style.color = `${bgIsLight?'#000':'#fff'}`;
    activebtn.style.color = '';
    completed.style.color = '';
    renderPage(data)
});

new Sortable(todoList, {
    animation: 350,
 
         onSort:function(e){
            const itemElText = e.item.children[1].children[0].innerHTML;
            data.forEach((todo,index)=>{
                let oldIndex = 0;
                if(itemElText == todo.name){
                    oldIndex = index;
                    let targetTodo = data.splice(oldIndex,1);
                    data.splice(e.newIndex,0,targetTodo[0])

                }
            })
            localStorage.setItem('todos', JSON.stringify(data));
         },

    
});

//================personal===========
const volumn = document.querySelector(".volumn");

const bgm = new Audio('./music.mp3')

const playBGM = ()=>{
   bgm.volume = 0.5;
   bgm.loop = true;
   bgm.autoplay = true;
   bgm.load();
   bgm.pause();
}
function isVolume(target){
   if(target.dataset.id === 'mute'){
      target.style.display = "none"
      target.previousElementSibling.style.display = "block"
      bgm.volume = 0.5;
      bgm.play();

   } else{
      target.style.display = "none"
      console.log(target.nextElementSibling)
      target.nextElementSibling.style.display = "block"
      bgm.volume = 0;
      bgm.pause();
   }
}

document.addEventListener('DOMContentLoaded', () => {
   playBGM();
})
volumn.addEventListener('click', (e) => isVolume(e.target))