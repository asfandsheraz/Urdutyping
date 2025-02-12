let words = []; // Array to store the selected words
let currentIndex = 0;
let startTime; // To track the start time of typing
let timerInterval; // To store the timer interval

// Function to initialize the app
async function initializeApp() {
    await loadWords('beginner'); // Load beginner words by default
    attachEventListeners(); // Attach all event listeners
    hideStartAgainButton(); // Hide the "Start Again" button initially
}

// Function to load words based on the selected category
async function loadWords(category) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/asfandsheraz/Urdutyping/refs/heads/main/words.json'); // Fetch the words.json file
        if (!response.ok) {
            throw new Error('Failed to load words');
        }
        const data = await response.json(); // Parse the JSON data
        words = data[category]; // Set the words array to the selected category
        currentIndex = 0; // Reset the index
        enableInputField(); // Enable the input field
        clearResultMessage(); // Clear the result message
        hideStartAgainButton(); // Hide the "Start Again" button
        showWord(); // Display the first word
        startTimer(); // Start the timer
    } catch (error) {
        console.error('Error loading words:', error);
    }
}

// Function to display the current and next word
function showWord() {
    if (currentIndex < words.length) {
        document.getElementById('word').textContent = words[currentIndex];
        document.getElementById('nextWord').textContent = words[(currentIndex + 1) % words.length];
    } else {
        // All words are completed
        stopTimer(); // Stop the timer
        displayCompletionMessage(); // Display completion message
        disableInputField(); // Disable the input field
        showStartAgainButton(); // Show the "Start Again" button
        displayTypingSpeed(); // Display typing speed
    }
}

// Function to check the input when space is pressed
function checkInput(event) {
    if (event.key === ' ') {
        const inputWord = document.getElementById('inputWord').value.trim();
        const resultDiv = document.getElementById('result');

        if (inputWord === words[currentIndex]) {
            displayFeedback('Correct!', 'correct');
            currentIndex++;
            showWord();
        } else {
            displayFeedback('Incorrect! Try again.', 'incorrect');
        }
        clearInputField();
    }
}

// Function to display feedback (correct/incorrect)
function displayFeedback(message, className) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = className;
}

// Function to display completion message
function displayCompletionMessage() {
    document.getElementById('word').textContent = 'Completed!';
    document.getElementById('nextWord').textContent = '';
    displayFeedback('You have completed all words in this category!', 'correct');
}

// Function to display typing speed
function displayTypingSpeed() {
    const timeTaken = (Date.now() - startTime) / 1000 / 60; // Time in minutes
    const wordsPerMinute = Math.round(words.length / timeTaken); // Words per minute
    document.getElementById('typingSpeed').textContent = `Typing Speed: ${wordsPerMinute} WPM`;
}

// Function to start the timer
function startTimer() {
    startTime = Date.now(); // Record the start time
    timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

// Function to update the timer display
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
    document.getElementById('timer').textContent = `Time: ${elapsedTime} seconds`;
}

// Function to clear the input field
function clearInputField() {
    document.getElementById('inputWord').value = '';
}

// Function to clear the result message
function clearResultMessage() {
    document.getElementById('result').textContent = '';
}

// Function to enable the input field
function enableInputField() {
    document.getElementById('inputWord').disabled = false;
}

// Function to disable the input field
function disableInputField() {
    document.getElementById('inputWord').disabled = true;
}

// Function to show the "Start Again" button
function showStartAgainButton() {
    document.getElementById('startAgain').style.display = 'inline-block';
}

// Function to hide the "Start Again" button
function hideStartAgainButton() {
    document.getElementById('startAgain').style.display = 'none';
}

// Function to attach all event listeners
function attachEventListeners() {
    document.getElementById('category').addEventListener('change', function () {
        const selectedCategory = this.value; // Get the selected category
        loadWords(selectedCategory); // Load words for the selected category
    });

    document.getElementById('startAgain').addEventListener('click', function () {
        const selectedCategory = document.getElementById('category').value; // Get the current category
        loadWords(selectedCategory); // Reload words for the selected category
    });

    document.getElementById('inputWord').addEventListener('keyup', checkInput);
}

// Initialize the app when the page loads
initializeApp();