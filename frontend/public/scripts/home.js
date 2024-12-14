// Join a chat
async function joinChat() {
    const chatId = document.getElementById("chatPin").value;
	console.log(`Fetching: /chat/${chatId}/join/guest`);

    if (!chatId) {
        alert("Please enter a chat PIN to join.");
        return;
    }

    try {
		console.log("Attempting fetch");
        const response = await fetch(`/chat/${chatId}/join/guest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
		console.log("Completed fetch");

        if (response.ok) {
			console.log("Good response");
            const data = await response.json();
			console.log("Data recieved");

            if (data.exists) {
                window.location.href = `/chat/${chatId}/${data.user_id}`;
            } else {
                alert("Chatroom not found.");
            }
        } else {
            const data = await response.json();
            alert(`Failed to join chatroom with error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error joining chat:", error);
        alert("An error occurred. Please try again.");
    }
}


// Create a chat
async function createChat() {
    console.log("Create Chat button clicked");

    try {
		console.log("Attempting fetch");
        const response = await fetch("/chat/create/guest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
		console.log("Fetch complete");

        if (response.ok) {
			console.log("Attempting to get data");
            const data = await response.json();  // Get the response data
			console.log("Data recieved");

            // Now use the returned chatId to redirect to the created chat page
            const chat_pin = data.chat_pin;  // Get the chatId (random PIN)

            // Redirect to the newly created chat page using the chatId
            window.location.href = `/chat/${chat_pin}/${data.user_id}`;
        } else {
            const data = await response.json();
            console.error("Error creating chat:", data.message || "Creating chat failed.");
            alert(data.message || "Creating chat failed.");
        }
    } catch (error) {
        console.error("Error creating chat:", error);  // Log the error here for better debugging
        alert("An error occurred. Please try again.");
    }
}