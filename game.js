const question = document.getElementById("question")
const choices = Array.from (document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progresBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const params = new URLSearchParams(window.location.search);
const topic = params.get("topic");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

const questionCount = document.getElementById("questionCount"); 
fetch(`data/${topic}.json`)
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions;
        loader.classList.add("hidden");
        document.getElementById("setup").classList.remove("hidden");
    })
    .catch(err => {
        console.error("Failed to load questions", err);
    });

document.getElementById("startBtn").addEventListener("click", () => {
    MAX_QUESTIONS = Math.min(parseInt(questionCount.value), questions.length);
    document.getElementById("setup").classList.add("hidden");
    game.classList.remove("hidden");
    startGame();
});

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 25;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //go to end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = "Question " + questionCounter + "/" + MAX_QUESTIONS;
    //Update the progress bar
    progresBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number]
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
         selectedAnswer == currentQuestion.answer ? "correct": "incorrect";

         if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
         }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
