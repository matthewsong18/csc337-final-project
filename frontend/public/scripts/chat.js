// DOM Elements
const chatNameElement = document.getElementById("chatName");
const chatInput = document.querySelector(".chatTextBox");
const pinNumberElement = document.getElementById("pinNumber");
const addOptionButton = document.getElementById("addOptionButton");
const pollForm = document.getElementById("pollForm");
const pollFormContainer = document.getElementById("pollFormContainer");
const additionalOptionsContainer = document.getElementById("additionalOptions");
const deleteOptionButtons = document.querySelectorAll(".deleteOptionButton");

// State Variables
const pathSegments = window.location.pathname.split('/');
const chatId = pathSegments[pathSegments.length - 1];
let optionCount = 2; // default lowest option counts

// Initialize Page
function initializePage() {
    displayChatPin();
    setupChatInputResize();
    setupEventListeners();
}

// Display the chat's PIN or fallback text
function displayChatPin() {
    pinNumberElement.textContent = chatId ? `PIN: ${chatId}` : "No PIN?";
}

// Resize the chat input dynamically
function setupChatInputResize() {
    chatInput.addEventListener("input", resizeChatInput);
}

function resizeChatInput() {
    chatInput.style.height = "auto"; // Reset height to calculate new height
    const maxHeight = Math.min(chatInput.scrollHeight, window.innerHeight * 0.25); // Max height is 25vh
    chatInput.style.height = `${maxHeight}px`; // Adjust height based on content
}

// Poll Form Management
function openPollForm() {
    pollFormContainer.style.display = "block";
}

function closePollForm() {
    pollFormContainer.style.display = "none";
    resetAllOptions();
}

function resetAllOptions() {
    optionCount = 0; // reset optionCount
    // delete all current options
    while (additionalOptionsContainer.firstChild) {
        additionalOptionsContainer.removeChild(additionalOptionsContainer.firstChild);
    }
    // create 2 initial options
    addPollOption();
    addPollOption();
}

// Add a new poll option
function addPollOption() {
    if (optionCount <= 10) {
        optionCount++;
        const newOptionInput = createInput(`pollOption${optionCount}`, true);
        const newDeleteButton = createDeleteButton();
        const newOptionItem = document.createElement("div");

        newOptionItem.classList.add("optionItem");
        newOptionItem.appendChild(newOptionInput);
        newOptionItem.appendChild(newDeleteButton);

        additionalOptionsContainer.appendChild(newOptionItem);
    } else {
        alert("A poll can't have more than 10 options");
    }
}

// Create reusable DOM elements
function createInput(id, required = false) {
    const input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Type your answer");
    input.classList.add("poll_option_title");
    if (required) input.setAttribute("required", true);

    return input;
}

function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("deleteOptionButton");
    deleteButton.textContent = "Delete";

    // Add event listener to delete the option
    deleteButton.addEventListener("click", () => {
        if (optionCount > 2) {
            optionCount -= 1;
            additionalOptionsContainer.removeChild(deleteButton.parentNode);
        } else {
            alert("A poll needs at least 2 options!");
        }
    });
    return deleteButton;
}

// Submit Poll Data
async function submitPoll(event) {
    event.preventDefault();

    const pollTitle = document.getElementById("pollTitle").value;
    const options = gatherPollOptions();

    if (!options.length) {
        alert("Please add at least one option.");
        return;
    }

    try {
        const response = await sendPollData(pollTitle, options);
        handlePollResponse(response);
    } catch (error) {
        console.error("Error creating poll:", error);
        alert("An error occurred. Please try again.");
    }
}

function gatherPollOptions() {
    const options = [];
    for (let i = 1; i <= optionCount; i++) {
        const optionValue = document.getElementById(`pollOption${i}`).value;
        if (optionValue) options.push(optionValue);
    }
    return options;
}

async function sendPollData(title, options) {
    return fetch(`/chat/${chatId}/poll`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollTitle: title, options }),
    });
}

function handlePollResponse(response) {
    if (response.ok) {
        alert("Poll created successfully!");
        closePollForm();
    } else {
        alert("Failed to create poll. Please try again.");
    }
}

// Setup Event Listeners for poll form
function setupEventListeners() {
    addOptionButton.addEventListener("click", addPollOption);
    pollForm.addEventListener("submit", submitPoll);
    deleteOptionButtons.forEach((button) => button.addEventListener("click", (event) => {
        if (optionCount > 2) {
            optionCount -= 1;
            additionalOptionsContainer.removeChild(button.parentNode);
        } else {
            alert("A poll needs at least 2 options!");
        }
    }));
}

// Initialize Script
initializePage();
