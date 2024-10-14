const userId = document.querySelector("#userId");
const userPw = document.querySelector("#userPw");
const loginBtn = document.querySelector(".loginBtn");

window.onload = function(){    
    userId.addEventListener("change", (event) => {
        fnLoginValidation();
    });
    userPw.addEventListener("change", (event) => {
        fnLoginValidation();
    });
}

function fnLoginValidation(){
    if(userId.value != "" && userPw.value != ""){
        loginBtn.classList.add('active');
    } else {
        loginBtn.classList.remove('active');
    }
}