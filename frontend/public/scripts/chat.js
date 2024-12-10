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
