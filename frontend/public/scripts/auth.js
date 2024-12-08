async function signupUser() {
    const userName = document.getElementById("usernamefield").value;

    if (!userName) {
        alert("Please enter a username.");
        return;
    }

    try {
        const response = await fetch(`/auth/signup/${userName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            window.location.href = `/profile/${userName}`;
        } else {
            const data = await response.json();
            alert(data.message || "Signup failed.");
        }
    } catch (error) {
        console.error("Error signing up:", error);
        alert("An error occurred. Please try again.");
    }
}

async function loginUser() {
    const userName = document.getElementById("usernamefield").value;

    if (!userName) {
        alert("Please enter a username.");
        return;
    }

    try {
        const response = await fetch(`/auth/login/${userName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            window.location.href = `/profile/${userName}`;
        } else {
            const data = await response.json();
            alert(data.message || "Login failed.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred. Please try again.");
    }
}