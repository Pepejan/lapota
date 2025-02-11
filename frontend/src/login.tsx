function handleLogin() {
    fetch("https://zdjimu9u4j.execute-api.us-east-1.amazonaws.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: "testuser", password: "password123" })
    })
        .then(response => response.json())
        .then(data => console.log("Login success:", data))
        .catch(error => console.error("Login error:", error));
}
export default handleLogin;