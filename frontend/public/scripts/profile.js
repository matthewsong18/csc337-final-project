const pathSegments = window.location.pathname.split('/');
	const username = pathSegments[pathSegments.length - 1];

	console.log("Extracted username:", username);

	const welcomeMessage = document.getElementById("username");
	if (username) {
		welcomeMessage.textContent = `${username}`;
	} else {
		welcomeMessage.textContent = "Unknown";
	}

// Join a chat
async function joinChat() {
    try {
		// get username and chatPin from profile.html
		const chat_pin = document.getElementById("chatPin").value;

		console.log(`Fetching: /chat/${username}/${chat_pin}/join/user`);

		if (!chat_pin) {
		alert("Please enter a chat PIN to join.");
		return;
		}

		console.log("Attempting fetch");
        const response = await fetch(`/chat/${username}/${chat_pin}/join/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
		console.log("Completed fetch");

        if (response.ok) {
			console.log("Good response");
            const data = await response.json();
			console.log("Data received");

            if (data.exists) {
				
				// redirects to chat page
                window.location.href = `/chat/${chat_pin}/${data.user_id}`;
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
	const chat_name = document.getElementById("chatName").value;

	if (!chat_name) {
		alert("Please enter a chat name to create chat.");
		return;
	}
    console.log("Create Chat button clicked");

    try {
		console.log("Attempting fetch");
        const response = await fetch(`/chat/create/${username}/${chat_name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
		console.log("Fetch complete");

        if (response.ok) {
			console.log("Attempting to get data");
            const data = await response.json();  // Get the response data
			console.log("Data received");


            // Now use the returned chatId to redirect to the created chat page
            const chat_pin = data.chat_pin;  // Get the chat_pin (random PIN)

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

async function loadChatHistory() {
	try {
		// Fetch user data by username
		const response = await fetch(`/auth/chats/${username}`);
		if (!response.ok) {
			throw new Error("Failed to load chat history.");
		}
	
		// Get all chats
		const data = await response.json();
		const chats = await data.chats;
		const user_id = await data.user_id;

		// Populate table with chat history
		await renderChatTable(chats, user_id);

	} catch (err) {
		console.error("Error loading chat history:", err);
	}
	
}

// Function to render the chat documents into the table
async function renderChatTable(chats, user_id) {
	const tableBody = document.querySelector("#chatHistory tbody");
  
	tableBody.innerHTML = "";
  
	chats.forEach(chat => {
	  const row = document.createElement("tr");
  
	  // Create cells for each chat's data
	  const nameCell = document.createElement("td");
	  nameCell.textContent = chat.name || "No Name";
	  row.appendChild(nameCell);
  
	  const pinCell = document.createElement("td");
	  pinCell.textContent = chat.pin || "No Pin";
	  row.appendChild(pinCell);
  
	  const usersCell = document.createElement("td");
	  usersCell.textContent = chat.users.length || "No Users";
	  row.setAttribute("onclick", `window.location.href = '../Chat/${chat.pin}/${user_id}'`);
	  row.appendChild(usersCell);

	  // Append the row to the table body
	  tableBody.appendChild(row);
  } )
}
	  
// Load chat history when the page loads
window.onload = () => {
	loadChatHistory(username);
};
	  

