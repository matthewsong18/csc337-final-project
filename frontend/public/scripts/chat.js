const chatNameElement = document.getElementById("chatName");
const pathSegments = window.location.pathname.split('/');
const chatId = pathSegments[pathSegments.length - 1]; // Extract the chatId (PIN)

// Display the PIN
const pinNumber = document.getElementById("pinNumber");
if (chatId) {
    pinNumber.textContent = `PIN: ${chatId}`;
} else {
    pinNumber.textContent = "No PIN?";
}

// Function to display the poll form
function createPollForm() {
    const formContainer = document.getElementById("pollFormContainer");
    formContainer.style.display = "block";
}

// Function to hide the poll form
function closePollForm() {
    const formContainer = document.getElementById("pollFormContainer");
    formContainer.style.display = "none";
}

// Handle poll form submission
document.getElementById("pollForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    const pollTitle = document.getElementById("pollTitle").value;
    const pollOption1 = document.getElementById("pollOption1").value;
    const pollOption2 = document.getElementById("pollOption2").value;

    // You can add additional options dynamically if needed

    // Example: Send the poll data to the backend
    const response = await fetch(`/api/chat/${chatId}/poll`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pollTitle,
            options: [pollOption1, pollOption2],
        }),
    });

    if (response.ok) {
        alert("Poll created successfully!");
        closePollForm(); // Close the form after submission
    } else {
        alert("Failed to create poll. Please try again.");
    }
});
