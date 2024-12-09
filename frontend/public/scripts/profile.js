const pathSegments = window.location.pathname.split('/');
	const username = pathSegments[pathSegments.length - 1];

	console.log("Extracted username:", username);

	const welcomeMessage = document.getElementById("welcomeMessage");
	if (username) {
		welcomeMessage.textContent = `Welcome, ${username}!`;
	} else {
		welcomeMessage.textContent = "Welcome!";
	}