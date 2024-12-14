// DOM Elements
const chatNameElement = document.getElementById("chatName");
const textingArea = document.querySelector(".texting_area");
const chatInput = document.querySelector(".chatTextBox");
const pinNumberElement = document.getElementById("pinNumber");
const addOptionButton = document.getElementById("addOptionButton");
const pollForm = document.getElementById("pollForm");
const pollFormContainer = document.getElementById("pollFormContainer");
const additionalOptionsContainer = document.getElementById("additionalOptions");
const deleteOptionButtons = document.querySelectorAll(".deleteOptionButton");

// State Variables
const pathSegments = window.location.pathname.split('/');
const chatId = pathSegments[pathSegments.length - 2];
let autoScrollEnabled = true;
let event_source;
let optionCount = 2; // default lowest option counts

// Initialize Page
function initializePage() {
    displayChatPin();
    loadChat();
    setupChatInputResize();
    setupEventListeners();
}

// Display the chat's PIN or fallback text
function displayChatPin() {
    pinNumberElement.textContent = chatId ? `PIN: ${chatId}` : "No PIN?";
}

function loadChat() {
	console.log("Loading chat");
    event_source = new EventSource(`http://localhost:3000/chat/${chatId}/events`);
    event_source.addEventListener("message", (event) => {
        console.log("listening for update");
        let chat_data = JSON.parse(event.data);
        console.log(chat_data);
        // assume only initial load is an array of objects
        if (Array.isArray(chat_data)) populateChat(chat_data);
        else renderChatElement(chat_data);
    });
	console.log("Chat loaded");
}

function renderChatElement(item) {
	console.log("Rendering chat");
    if (item.options) renderPoll(item);
    else if (item.content) renderMessage(item);
	loadChat();
    // Scroll to the bottom of the chat container
    autoScroll();
}

// Function to auto-scroll if enabled
function autoScroll() {
    if (autoScrollEnabled) {
        textingArea.scrollTo({
            top: textingArea.scrollHeight,
            behavior: "smooth",
        });
    }
}

function populateChat(initial_chat) {
    console.log("populate chat");
    for (item of initial_chat) {
        renderChatElement(item);
    }
}

// Render a poll
function renderPoll(poll) {
    console.log("Poll options in renderPoll:", poll.options);
    const container = createContainer();
    const senderInfo = createSenderInfo("User", new Date().toISOString());
	console.log("Time Created: ", poll.createdAt);
    const pollContent = createPollContent(poll);
    container.append(senderInfo, pollContent);
    textingArea.appendChild(container);
}

function createContainer() {
    const container = document.createElement("div");
    container.classList.add("message_container");
    return container;
}

function createSenderInfo(author, time) {
    const senderInfo = document.createElement("div");
    senderInfo.classList.add("sender_info");
    const senderName = document.createElement("div");
    senderName.setAttribute("id", "sender_name");
    senderName.textContent = author;
    const timestamp = document.createElement("div");
    timestamp.setAttribute("id", "timestamp");
    timestamp.textContent = formatTimestamp(time);
    senderInfo.append(senderName, timestamp);
    return senderInfo;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear() % 100; // Get the last two digits of the year

    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format

    // Check if the date matches today or yesterday
    const isToday =
        date.toDateString() === now.toDateString();
    const isYesterday =
        date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();

    if (isToday) {
        return `Today at ${formattedHour}:${minute} ${ampm}`;
    } else if (isYesterday) {
        return `Yesterday at ${formattedHour}:${minute} ${ampm}`;
    }

    // Default to MM/DD/YY format
    return `${month}/${day}/${year}, ${formattedHour}:${minute} ${ampm}`;
}


function createPollContent(pollData) {
    const { title, options, users_voted } = pollData;

    // Check if options is an array and not empty
    if (!Array.isArray(options) || options.length === 0) {
        console.error("Invalid or empty options:", options);
        return;  // Prevent further processing if options is invalid
    }

    // Create the main poll container
    const pollContent = document.createElement("div");
    pollContent.classList.add("poll_content");
	console.log("Options:", options); // Log options to check if it's valid
    const pollOptionsForm = createPollOptionsForm(options);
    const pollFooter = createPollFooter(users_voted, pollData);
	const pollHeader= createPollHeader(title);
    pollContent.appendChild(pollHeader);
    pollContent.appendChild(pollOptionsForm);
    pollContent.appendChild(pollFooter);
    return pollContent;
}

function createPollHeader(title) {
    const pollHeader = document.createElement("div");
    pollHeader.classList.add("poll_header");

    const pollTitle = document.createElement("div");
    pollTitle.classList.add("poll_title");
    pollTitle.textContent = title;

    pollHeader.appendChild(pollTitle);
    return pollHeader;
}

function createPollOptionsForm(options) {
    // Ensure options is a valid array
    if (!Array.isArray(options)) {
        console.error("Invalid options array:", options);
        return;
    }

    console.log("Options at createPollOptionsForm: ", options);

    const pollOptionsForm = document.createElement("form");
    pollOptionsForm.classList.add("poll_options");

    options.forEach(option => {
        const optionLabel = document.createElement("label");
        optionLabel.classList.add("poll_option");

        const optionText = document.createElement("span");
        optionText.classList.add("option_text");
        optionText.textContent = option.title;

        const optionContainer = document.createElement("div");

        const optionCount = document.createElement("span");
        optionCount.classList.add("poll_option_count");
        optionCount.textContent = `${option.vote_count} votes`;

        const optionInput = document.createElement("input");
        optionInput.type = "checkbox";
        optionInput.name = "vote_option";
        optionInput.value = option.title;

        optionContainer.appendChild(optionCount);
        optionContainer.appendChild(optionInput);

        optionLabel.appendChild(optionText);
        optionLabel.appendChild(optionContainer);

        pollOptionsForm.appendChild(optionLabel);
    });

    return pollOptionsForm;
}

function createPollFooter(users_voted, pollData) {
	console.log("Poll data: ", pollData);
    const pollFooter = document.createElement("div");
    pollFooter.classList.add("poll_footer");

    const voteCount = document.createElement("span");
    voteCount.classList.add("vote_count");
    voteCount.textContent = `Total Votes: ${users_voted.length}`;

    const voteButton = document.createElement("button");
    voteButton.type = "submit";
    voteButton.classList.add("vote_button");
    voteButton.textContent = "Vote";

    voteButton.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const selectedOptions = [];
        const checkboxes = document.querySelectorAll(".poll_options input[type='checkbox']:checked");
        checkboxes.forEach(checkbox => selectedOptions.push(checkbox.value));

        if (selectedOptions.length > 0) {
            try {
                const response = await submitVotes(pollData._id, selectedOptions);
                if (response.ok) {
                    alert("Your vote has been submitted!");
                } else {
                    alert("Failed to submit vote.");
                }
            } catch (error) {
                console.error("Error submitting vote:", error);
                alert("An error occurred. Please try again.");
            }
        } else {
            alert("Please select at least one option to vote.");
        }
    });

    pollFooter.appendChild(voteCount);
    pollFooter.appendChild(voteButton);
    return pollFooter;
}

// Submit votes to the server
async function submitVotes(pollId, selectedOptions) {
	console.log("pollId: ", pollId);
	console.log("selectedOptions: ", selectedOptions);
    const response = await fetch(`/chat/${chatId}/poll/${pollId}/vote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedOptions }),
    });
    return response;
}

// Render a message
function renderMessage(message) {
    console.log("render message");
    const container = createContainer();
    const senderInfo = createSenderInfo(message.author, message.createdAt);
    const messageContent = createMessageContent(message.content);
    container.append(senderInfo, messageContent);
    textingArea.appendChild(container);
}

function createMessageContent(content) {
    const messageContent = document.createElement("div");
    messageContent.classList.add("message_content");
    messageContent.textContent = content;
    return messageContent;
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

        if (response.ok) {
            const pollData = await response.json();
            handlePollResponse(pollData);  // Directly handle the poll response
        } else {
            throw new Error('Failed to create poll');
        }
    } catch (error) {
        console.error("Error creating poll:", error);
        alert("An error occurred. Please try again.");
    }
}


function gatherPollOptions() {
    const options = [];
    for (let i = 1; i <= optionCount; i++) {
        const optionValue = document.getElementById(`pollOption${i}`).value;
        if (optionValue) {
            options.push({ title: optionValue, vote_count: 0 }); // Initialize vote_count to 0
        }
    }
    return options;
}

async function sendPollData(title, options) {
    console.log("Sending poll data");
    console.log("Chat ID: ", chatId);
    console.log("Title: ", title);
    console.log("Options: ", options);

    return fetch(`/chat/${chatId}/poll`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollTitle: title, options }),
    });
}


function handlePollResponse(pollData) {
    if (pollData) {
        alert("Poll created successfully!");
        closePollForm();
        renderPoll(pollData);  // Now passing the poll data to renderPoll
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
    // Event listener for user scrolling
    textingArea.addEventListener("scroll", () => {
        if (isAtBottom()) {
            autoScrollEnabled = true; // Re-enable auto-scroll if the user is at the bottom
        } else {
            autoScrollEnabled = false; // Disable auto-scroll if the user scrolls up
        }
    });
}

function isAtBottom() {
    const currentScrollPosition = textingArea.scrollTop + textingArea.clientHeight;
    const totalScrollArea = textingArea.scrollHeight - 10; // 10 is to account for small discrepancies
    return currentScrollPosition >= totalScrollArea;
}

// Initialize Script
initializePage();
