function handleRegister() {
    fetch("https://zdjimu9u4j.execute-api.us-east-1.amazonaws.com/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: "newuser", password: "password123" })
    })
        .then(response => response.json())
        .then(data => console.log("Registration success:", data))
        .catch(error => console.error("Registration error:", error));
}

export default handleRegister;