export const VISUALIZATION_TYPES = ["bar", "pie", "stackedBar"];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
    // unbiased random ordering
    for (let i = items.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

export function generateTrial(visualization, trialNumber) {
    const count = randomInt(5, 10);
    const values = Array.from({ length: count }, () => randomInt(1, 100));
    const firstIndex = randomInt(0, count - 1);
    let secondIndex = randomInt(0, count - 1);
    while (secondIndex === firstIndex) {
        secondIndex = randomInt(0, count - 1);
    }

    const firstValue = values[firstIndex];
    const secondValue = values[secondIndex];
    const smaller = Math.min(firstValue, secondValue);
    const larger = Math.max(firstValue, secondValue);

    return {
        trialNumber,
        visualization,
        values,
        markedIndices: [firstIndex, secondIndex],
        markedValues: [firstValue, secondValue],
        correctPercentage: (smaller / larger) * 100
    };
}

 //creates a balanced set 20 trials for each visualization by default shuffles complete list so conditions appear in random order
export function generateExperimentTrials(trialsPerVisualization = 20) {
    const trials = [];
    for (const visualization of VISUALIZATION_TYPES) {
        for (let i = 0; i < trialsPerVisualization; i++) {
            trials.push(generateTrial(visualization, trials.length + 1));
        }
    }
    shuffle(trials);
    trials.forEach((trial, index) => {
        trial.trialNumber = index + 1;
    });
    return trials;
}