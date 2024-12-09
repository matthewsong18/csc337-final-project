// Join a chat
async function joinChat() {
    const chatId = document.getElementById("chatPin").value;

    if (!chatId) {
        alert("Please enter a chatPin to join.");
        return;
    }

    try {
        const response = await fetch(`/chat/join/${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            window.location.href = `/chat/${chatId}`;
        } else {
            const data = await response.json();
            alert(data.message || "Joining chat failed.");
        }
    } catch (error) {
        console.error("Error joining chat:", error);
        alert("An error occurred. Please try again.");
    }
}

// Create a chat
async function createChat() {

    try {
        const response = await fetch(`/chat/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Extracts the chatId from the returned json
            const chatId = data.chatId;
            window.location.href = `/chat/${chatId}`;
        } else {
            const data = await response.json();
            alert(data.message || "Creating chat failed.");
        }
    } catch (error) {
        console.error("Error creating chat:", error);
        alert("An error occurred. Please try again.");
    }
}