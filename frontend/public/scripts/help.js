
document.addEventListener("DOMContentLoaded", () => {
	//Different types of elements on the help page
    const helpButtons = document.querySelectorAll(".help-button");
    const popup = document.getElementById("help-popup");
    const popupContent = document.getElementById("popup-text");
    const closePopup = document.getElementById("close-popup");

	//Content to display for each pop-up
    const helpContent = {
        account: "<h2>Account</h2><p>AChat accounts can be easily created with just a username. Accounts are not secure and users are always meant to stay anonymous. Never share any sensitive information on this website please.</p>",
        features: "<h2>Features</h2><p>AChat supports fast and painless chatroom creation. These chats allow for conversations using text, as well as the ability to create polls to enhance interactions between groups. Chats can be saved if you find them interesting and they can be accessed later on through the Profile Page.</p>",
        safety: "<h2>Safety and Guidelines</h2><p>This site is not safe. Other people can access your account if they know the name because there is no password required. Your chats will be anonymous to those you are chatting with, however make sure not to include anything you don't want strangers to know anywhere in your messages because that information can be accessed by anybody.</p>",
        usage: "<h2>Usage</h2><p><strong>Creating Chats - </strong>To create a chat simply select the \"Create Chat\ button and a chatroom with a unique PIN will be generated. <br><strong>Joining Chats - </strong>To join a chat which has already been created by somebody else you must recieve an 8-digit PIN from them. When you enter this pin and select \"Join Chat\" it will take you to their chatroom.<br><strong>Logging In - </strong>Users can login using a name with no password. Saved chats can be accessed in the Profile Page once the user is logged in.</p>"
    };

	//Make pop-up with the associated content visible when helpButton is pressed
    helpButtons.forEach(button => {
        button.addEventListener("click", () => {
            const section = button.getAttribute("data-section");
            popupContent.innerHTML = helpContent[section] || "<p>Content not found.</p>";
            popup.classList.add("visible");
        });
    });

	//Make the pop-up invisible again when the close button is pressed
    closePopup.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

	//Make the pop-up invisible if the user clicks outside of it
    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.classList.remove("visible");
        }
    });
});