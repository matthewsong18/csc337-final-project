// Extract the error message from the query string
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

// Set the error message in the page
if (message) {
    document.getElementById('errorMessage').textContent = decodeURIComponent(message);
}
