const quizQuestions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Computer Style Sheets",
    ],
    correctAnswer: "Cascading Style Sheets",
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Netscape", "Microsoft", "Oracle"],
    correctAnswer: "Netscape",
  },
  {
    question: "Which of these is used to declare a variable in JavaScript?",
    options: ["var", "let", "const"],
    correctAnswer: "var",
  },
  {
    question: "Which of the following is not a programming language?",
    options: ["Python", "HTML", "JavaScript"],
    correctAnswer: "HTML",
  },
  {
    question: "Which of the following is a JavaScript data type?",
    options: ["String", "Function", "Class"],
    correctAnswer: "String",
  },
  {
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Standard Query Language",
      "Simple Query Language",
    ],
    correctAnswer: "Structured Query Language",
  },
  {
    question: "Which of these is used to style the HTML elements?",
    options: ["HTML", "CSS", "JavaScript"],
    correctAnswer: "CSS",
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "CSS", "JavaScript"],
    correctAnswer: "CSS",
  },
  {
    question: "What is the purpose of the 'this' keyword in JavaScript?",
    options: [
      "To refer to the current object",
      "To declare a new variable",
      "To create a function",
    ],
    correctAnswer: "To refer to the current object",
  },
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleOptions() {
  quizQuestions.forEach((question) => {
    shuffleArray(question.options);
  });
}

let score = 0;
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = 60;
let timer;
let userName = "";

// DOM Elements
const startButton = document.getElementById("start-btn");
const quizContent = document.getElementById("quiz-content");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("timer");
const progressBarElement = document.getElementById("progress-bar");
const highScoresSection = document.getElementById("high-scores");
const highScoresList = document.getElementById("high-scores-list");
const greetingMessage = document.getElementById("greeting-message");
const answersSection = document.getElementById("answers-section");
const showAnswersButton = document.getElementById("show-answers-btn");
const backButton = document.getElementById("back-btn");
const userNameSection = document.getElementById("user-name-section");
const userNameInput = document.getElementById("user-name");
const questionNumbersElement = document.getElementById("question-numbers");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");

// Start the quiz
startButton.addEventListener("click", startQuiz);

function startQuiz() {
  userName = userNameInput.value.trim();
  if (userName === "") {
    alert("Please enter your name.");
    return;
  }

  userNameSection.style.display = "none";
  quizContent.style.display = "block";
  score = 0;
  currentQuestionIndex = 0;
  userAnswers = [];
  timeLeft = 60;
  // Shuffle the questions before starting the quiz
  shuffleArray(quizQuestions);
  shuffleOptions();

  startTimer();
  showQuestion();
}

// Timer Functionality
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    const progress = ((60 - timeLeft) / 60) * 100;
    progressBarElement.style.width = `${progress}%`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

// Show a question
function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.onclick = () => checkAnswer(option);
    optionsElement.appendChild(button);
  });

  updateQuestionNavigation();
}

// Check if the selected answer is correct
function checkAnswer(selectedAnswer) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = selectedAnswer;

  // Apply styles for answered state
  const optionButtons = optionsElement.querySelectorAll(".option-btn");
  optionButtons.forEach((button) => {
    button.classList.add("answered"); // Mark the option as answered (with blue border)
    if (button.textContent === selectedAnswer) {
      button.classList.add("selected"); // Add selected class for the chosen option
      // If correct answer, mark it with green background
      if (selectedAnswer === currentQuestion.correctAnswer) {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    } else {
      button.classList.remove("selected");
      button.classList.remove("correct");
      button.classList.remove("incorrect");
    }
  });

  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++;
  }

  nextButton.disabled = false; // Enable next button after selecting an answer
}

// Update question navigation (numbers and buttons)
function updateQuestionNavigation() {
  questionNumbersElement.innerHTML = "";
  quizQuestions.forEach((_, index) => {
    const numberBox = document.createElement("span");
    numberBox.classList.add("question-number");
    numberBox.textContent = index + 1;

    numberBox.addEventListener("click", () => {
      currentQuestionIndex = index;
      showQuestion();
    });

    // If this question is already answered, mark it as selected (blue border)
    if (userAnswers[index]) {
      numberBox.classList.add("answered");
    }

    // Add the 'current' class to highlight the current question
    if (index === currentQuestionIndex) {
      numberBox.classList.add("current");
    }

    questionNumbersElement.appendChild(numberBox);
  });

  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = currentQuestionIndex === quizQuestions.length - 1;
}

// Show next question
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
});

// Show previous question
prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

// Submit the quiz
submitButton.addEventListener("click", endQuiz);

// End the quiz and show high scores
function endQuiz() {
  clearInterval(timer);
  showHighScores();
}

// Display high scores
function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push({ name: userName, score: score });

  highScores.sort((a, b) => b.score - a.score);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  greetingMessage.innerHTML = `<h3>Congratulations, ${userName}! Your score is ${score}.</h3>`;

  highScoresList.innerHTML = "";
  highScores.slice(0, 5).forEach((entry, index) => {
    const scoreItem = document.createElement("li");
    if (index === 0) {
      scoreItem.classList.add("first");
      scoreItem.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill=" #ffd700" class="bi bi-trophy-fill" viewBox="0 0 16 16">
  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
</svg>${entry.name}: ${entry.score}`;
    } else if (index === 1) {
      scoreItem.classList.add("second");
      scoreItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#c0c0c0" class="bi bi-trophy-fill" viewBox="0 0 16 16">
  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
</svg>${entry.name}: ${entry.score}`;
    } else if (index === 2) {
      scoreItem.classList.add("third");
      scoreItem.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill=" #cd7f32" class="bi bi-trophy-fill" viewBox="0 0 16 16">
  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
</svg> ${entry.name}: ${entry.score}`;
    } else {
      scoreItem.innerHTML = `${entry.name}: ${entry.score}`;
    }

    highScoresList.appendChild(scoreItem);
  });

  quizContent.style.display = "none";
  highScoresSection.style.display = "block";
}

// Show or hide answers section
showAnswersButton.addEventListener("click", () => {
  if (answersSection.style.display === "block") {
    answersSection.style.display = "none";
  } else {
    displayAnswers();
    answersSection.style.display = "block";
  }

  answersSection.scrollTop = 0;
});

// Display all answers
function displayAnswers() {
  answersSection.innerHTML = "";
  quizQuestions.forEach((q, index) => {
    const answerItem = document.createElement("div");
    answerItem.classList.add("answer-item");

    answerItem.innerHTML = `<div class="question-text">${index + 1}. ${
      q.question
    }</div>`;

    q.options.forEach((option) => {
      let optionClass = "";
      if (option === q.correctAnswer) {
        optionClass = "correct-answer";
      } else if (userAnswers[index] === option) {
        optionClass = "incorrect-answer";
      } else {
        optionClass = "normal-option";
      }

      answerItem.innerHTML += `<div class="answer-option ${optionClass}">${option}</div>`;
    });

    answersSection.appendChild(answerItem);
  });
}

backButton.addEventListener("click", () => {
  userNameSection.style.display = "block";
  highScoresSection.style.display = "none";
  quizContent.style.display = "none";
  userNameInput.value = "";
  highScoresList.innerHTML = "";
  answersSection.style.display = "none";
  greetingMessage.innerHTML = "";

  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60;
  clearInterval(timer);
});
