const chatNameElement = document.getElementById("chatName");
const pathSegments = window.location.pathname.split('/');
const chatId = pathSegments[pathSegments.length - 1];

const pinNumber = document.getElementById("pinNumber");
if (chatId) {
    pinNumber.textContent = `PIN: ${chatId}`;
} else {
    pinNumber.textContent = "No PIN?";
}

function createPollForm() {
    const formContainer = document.getElementById("pollFormContainer");
    formContainer.style.display = "block";
}

function closePollForm() {
    const formContainer = document.getElementById("pollFormContainer");
    formContainer.style.display = "none";
}

let optionCount = 2;

function addPollOption() {
    optionCount++;

    const newOptionLabel = document.createElement("label");
    newOptionLabel.setAttribute("for", `pollOption${optionCount}`);
    newOptionLabel.textContent = `Option ${optionCount}:`;

    const newOptionInput = document.createElement("input");
    newOptionInput.setAttribute("type", "text");
    newOptionInput.setAttribute("id", `pollOption${optionCount}`);
    newOptionInput.setAttribute("name", `pollOption${optionCount}`);
    newOptionInput.setAttribute("required", true);

    const additionalOptionsContainer = document.getElementById("additionalOptions");
    additionalOptionsContainer.appendChild(newOptionLabel);
    additionalOptionsContainer.appendChild(newOptionInput);
    additionalOptionsContainer.appendChild(document.createElement("br"));
    additionalOptionsContainer.appendChild(document.createElement("br"));
}

document.getElementById("addOptionButton").addEventListener("click", addPollOption);

document.getElementById("pollForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const pollTitle = document.getElementById("pollTitle").value;
    const options = [];

    for (let i = 1; i <= optionCount; i++) {
        const optionValue = document.getElementById(`pollOption${i}`).value;
        if (optionValue) {
            options.push(optionValue);
        }
    }

    const response = await fetch(`/api/chat/${chatId}/poll`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pollTitle,
            options,
        }),
    });

    if (response.ok) {
        alert("Poll created successfully!");
        closePollForm();
    } else {
        alert("Failed to create poll. Please try again.");
    }
});

document.getElementById("pollForm").addEventListener("submit", async (event) => {
    //This is where the API request needs to be sent to create a new Poll.
});
