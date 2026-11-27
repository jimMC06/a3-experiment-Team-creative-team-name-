import { generateExperimentTrials } from "./random-data.js";
import { drawVisualization } from "./charts/visualizations.js";

// Trials
const trials = generateExperimentTrials(20);
const totalTrials = trials.length;
let currentTrial = 0;

// Store participant responses
const responses = [];

// Screens
const introScreen = document.getElementById("intro-screen");
const experimentScreen = document.getElementById("experiment-screen");
const completeScreen = document.getElementById("complete-screen");

// Buttons and inputs
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const responseForm = document.getElementById("response-form");
const answerInput = document.getElementById("answer-input");

// Experiment elements
const trialCounter = document.getElementById("trial-counter");
const progressFill = document.getElementById("progress-fill");
const chartContainer = document.getElementById("chart-container");


// Switch between screens
function showScreen(screen) {
    introScreen.hidden = screen !== "intro";
    experimentScreen.hidden = screen !== "experiment";
    completeScreen.hidden = screen !== "complete";
}


// Start the experiment
function startExperiment() {
    currentTrial = 0;
    showScreen("experiment");
    displayTrial();
}


// Display the current trial
function displayTrial() {
    // Update the trial counter
    trialCounter.textContent =
        `Trial ${currentTrial + 1} of ${totalTrials}`;

    // Update progress bar
    const progress = (currentTrial / totalTrials) * 100;
    progressFill.style.width = `${progress}%`;

    // Reset answer input
    answerInput.value = "";

    // Clear previous visualization
    chartContainer.replaceChildren();

    // Draw the current visualization
    const trial = trials[currentTrial];
    drawVisualization(chartContainer, trial);
    // Focus the answer input
    answerInput.focus();
}


// Handle submitted answers
function submitAnswer(event) {
    event.preventDefault();
    const answer = Number(answerInput.value);
    // Check input
    if (answerInput.value.trim() === "" || !Number.isFinite(answer) || answer < 0 || answer > 100){
        alert("Please enter a valid percentage between 0 and 100.");
        return;
    }

    // Get information about the current trial
    const trial = trials[currentTrial];
    // Record the participant's response
    const responseData = {
        trialNumber: currentTrial + 1,
        visualization: trial.visualization,
        values: trial.values.join(";"),
        markedIndices: trial.markedIndices.join(";"),
        correctPercentage: trial.correctPercentage,
        participantAnswer: answer
    };

    // add response to our collection
    responses.push(responseData);
    // display recorded response for testing
    console.log("Recorded response:", responseData);
    // Go next trial
    currentTrial++;

    if (currentTrial >= totalTrials) {
        progressFill.style.width = "100%";
        showScreen("complete");

        console.log("All participant responses:", responses);

        // download results
        downloadResponsesCSV();
    } else {
        // display next trial
        displayTrial();
    }
}

// download participant responses as CSV file
function downloadResponsesCSV() {
    if (responses.length === 0) {
        alert("No responses have been recorded.");
        return;
    }
    const headers = Object.keys(responses[0]);
    // escape values so its safe for CSV 
    const escapeCSV = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csvRows = [
        headers.map(escapeCSV).join(","),
        ...responses.map(response =>
            headers.map(header => escapeCSV(response[header])).join(",")
        )
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "participant-responses.csv";
    link.click();
    URL.revokeObjectURL(url);
}
// connect buttons and form
startButton.addEventListener("click", startExperiment);
responseForm.addEventListener("submit", submitAnswer);
// Restarts experiment by returning to intro
restartButton.addEventListener("click", () => {
    showScreen("intro");
});
// show introduction screen when page loads
showScreen("intro");