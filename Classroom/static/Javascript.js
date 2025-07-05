let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let nameField = document.getElementById("nameField");
let phoneField = document.getElementById("phoneField");
let title = document.getElementById("title");


signinBtn.onclick = function() {
    nameField.style.maxHeight = "0px";
    phoneField.style.maxHeight = "0px";
    title.innerText ="Sign In";
    signupBtn.classList.add("disableEm");
    signinBtn.classList.remove("disableEm");
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");
    clearFields();
   
}

signupBtn.onclick = function() {
    nameField.style.maxHeight = "60px";
    phoneField.style.maxHeight = "60px";
    title.innerText ="Sign Up";
    signinBtn.classList.add("disableEm");
    signupBtn.classList.remove("disableEm");
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
    validateFields();
    // clearFields and clearErrorMessages moved after fetch in event listener
   
   
}
function validateFields() {
  console.log("validateFields() called");

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();

    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let phoneError = document.getElementById("phoneError");
    let passwordError = document.getElementById("passwordError");

    if (nameError) nameError.innerText = name === "" ? "Name is required!" : "";
    if (emailError) emailError.innerText = email === "" ? "Email is required!" : "";
    if (phoneError) phoneError.innerText = phone === "" ? "Phone number is required!" : "";
    if (passwordError) passwordError.innerText = password === "" ? "Password is required!" : "";
}

function clearFields() {
     console.log("clearField() called");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("password").value = "";
}
function clearErrorMessages() {
    let errorFields = ["nameError", "emailError", "phoneError", "passwordError"];
    errorFields.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.innerText = "";
        } else {
            console.error(`Element with ID ${id} not found!`);
        }
    });
}


// --- Add event listeners for backend communication ---
document.getElementById("signupBtn").addEventListener("click", function(event) {
    event.preventDefault();
    if (title.innerText === "Sign Up") {
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let password = document.getElementById("password").value.trim();
        fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password })
        })
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .then(result => {
            alert(result.body.msg);
            clearFields();
            clearErrorMessages();
        });
    }
});

document.getElementById("signinBtn").addEventListener("click", function() {
    if (title.innerText === "Sign In") {
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .then(result => {
            alert(result.body.msg);
        });
    }
});

