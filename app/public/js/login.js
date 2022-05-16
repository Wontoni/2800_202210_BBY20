document.getElementById("login-button").addEventListener("click", () => {
    fetch("/login", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "username" : document.getElementById("username").value,
            "password" : document.getElementById("userPassword").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("username").value = null;
        document.getElementById("userPassword").value = null;
        document.getElementById("login-message").innerHTML = data;
    }).catch(() => {
        window.location.href = "/main";
    });
});