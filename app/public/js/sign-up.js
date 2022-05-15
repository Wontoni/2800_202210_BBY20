document.getElementById("signup-button").addEventListener("click", () => {
    fetch("/sign-up", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "username" : document.getElementById("username").value,
            "email" : document.getElementById("userEmail").value,
            "password" : document.getElementById("userPassword").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        document.getElementById("username").value = null;
        document.getElementById("userEmail").value = null;
        document.getElementById("userPassword").value = null;
        document.getElementById("signup-message").innerHTML = data.message;
    }).catch((error) => {
        window.location.href = "/login";
    })
});