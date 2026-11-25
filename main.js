// D3 visualization imports below, we can uncomment or change them later its just an idea
// like I said before we dont need to do bar-charts, pie-charts or whatever
// import drawBarChart from "./charts/bar-chart.js";
// import drawPieChart from "./charts/pie-chart.js";
// import drawStackedBarChart from "./charts/stacked-bar-chart.js";

// Trials
const totalTrials = 5; // I have it set to 5 right now for testing, we will bump it up to 60 once we are ready
let currentTrial = 0;

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


function showScreen(screen){ // Switch Screens
    introScreen.hidden = screen !== "intro";
    experimentScreen.hidden = screen !== "experiment";
    completeScreen.hidden = screen !== "complete";
}


function startExperiment(){ // Start Experimetn
    currentTrial = 0;
    showScreen("experiment");
    displayTrial();
}


// Display the current trial
function displayTrial(){
    trialCounter.textContent = `Trial ${currentTrial + 1} of ${totalTrials}`; //Update the trial counter

    // Update progress bar
    const progress = (currentTrial / totalTrials) * 100;
    progressFill.style.width = `${progress}%`;

    // Reset answer input
    answerInput.value = "";

    // Clear previous visualization
    chartContainer.replaceChildren();

    // FIX LATER!!!!!!!!!!!
    // WE WILL DISPLAY THE D3 VISUALIZATIONS HERE!!
    // Once chart and trial generation are implemented ofc (:

    answerInput.focus();
}

// Handle submitted answers
function submitAnswer(event){
    event.preventDefault();

    const answer = Number(answerInput.value);

    // Check input
    if (answerInput.value.trim() === "" || !Number.isFinite(answer) || answer < 0 || answer > 100){
        alert("Please enter a valid percentage between 0 and 100.");
        return;
    }

    // FIX AND IMPLEMENT LATER
    // WE NEED TO RECORD USER INPUTS/ANSWERS AND ADD THEM TO A CSV WE CAN USE LATER
    console.log("Answer:", answer);

    // Go next trial
    currentTrial++;
    if (currentTrial >= totalTrials){
        progressFill.style.width = "100%";
        showScreen("complete");
    } else {
        displayTrial();
    }
}

startButton.addEventListener("click", startExperiment);
responseForm.addEventListener("submit", submitAnswer);

restartButton.addEventListener("click", () => {
    showScreen("intro");
});
showScreen("intro");
