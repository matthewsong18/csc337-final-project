// help.js

document.addEventListener("DOMContentLoaded", () => {
    const helpButtons = document.querySelectorAll(".help-button");
    const popup = document.getElementById("help-popup");
    const popupContent = document.getElementById("popup-text");
    const closePopup = document.getElementById("close-popup");

    const helpContent = {
        account: "<h2>Account</h2><p>AChat accounts can be easily created with just a username. Accounts are not secure and users are always meant to stay anonymous. Never share any sensitive information on this website please.</p>",
        features: "<h2>Features</h2><p>AChat supports fast and painless chatroom creation. These chats allow for conversations using text, as well as the ability to create polls to enhance interactions between groups. Chats can be saved if you find them interesting and they can be accessed later on through the Profile Page.</p>",
        safety: "<h2>Safety and Guidelines</h2><p>This site is not safe. Other people can access your account if they know the name because there is no password required. Your chats will be anonymous to those you are chatting with, however make sure not to include anything you don't want strangers to know anywhere in your messages because that information can be accessed by anybody.</p>",
        troubleshooting: "<h2>Troubleshooting</h2><p><strong>Joining Chats - </strong>To join a chat which has already been created by somebody else you must recieve an 8-digit PIN from them. When you enter this pin and select \"Join Chat\" it will take you to their chatroom.</p>"
    };

    helpButtons.forEach(button => {
        button.addEventListener("click", () => {
            const section = button.getAttribute("data-section");
            popupContent.innerHTML = helpContent[section] || "<p>Content not found.</p>";
            popup.classList.add("visible");
        });
    });

    closePopup.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.classList.remove("visible");
        }
    });
});