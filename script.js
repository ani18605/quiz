const questions = [
    {
        question: 'Which HTML tag is used to define an inline style?',
        choice1: '<script>',
        choice2: '<css>',
        choice3: '<style>',
        choice4: '<span>',
        answer: 3,
    },
    {
        question: 'Which property is used to change the text color in CSS?',
        choice1: 'text-color',
        choice2: 'font-color',
        choice3: 'text-style',
        choice4: 'color',
        answer: 4,
    },
    {
        question: 'Which of the following is the correct way to comment in HTML?',
        choice1: '// Comment',
        choice2: '<!-- Comment -->',
        choice3: '/* Comment */',
        choice4: '<! Comment>',
        answer: 2,
    },
    {
        question: 'What does CSS stand for?',
        choice1: 'Cascading Style Sheets',
        choice2: 'Creative Style Selector',
        choice3: 'Computer Style Syntax',
        choice4: 'Cascading Script Styles',
        answer: 1,
    },
    {
        question: 'Which HTML tag is used to create a hyperlink?',
        choice1: '<link>',
        choice2: '<href>',
        choice3: '<a>',
        choice4: '<hyperlink>',
        answer: 3,
    },
    {
        question: 'What is the correct way to refer to an external script called "script.js"?',
        choice1: '<script src="script.js">',
        choice2: '<script href="script.js">',
        choice3: '<javascript src="script.js">',
        choice4: '<link src="script.js">',
        answer: 1,
    },
    {
        question: 'What does HTML stand for?',
        choice1: 'Hyperlinks and Text Markup Language',
        choice2: 'Hyper Text Markup Language',
        choice3: 'Home Tool Markup Language',
        choice4: 'Hyperlink Text Management Language',
        answer: 2,
    },
    {
        question: 'Which CSS property is used to change the size of text?',
        choice1: 'font-size',
        choice2: 'text-size',
        choice3: 'font-style',
        choice4: 'text-style',
        answer: 1,
    }
];

const questionElement = document.getElementById('question');
const choices = document.querySelectorAll('.choice');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const timerElement = document.getElementById('timer');
let currentQuestionIndex = 0;
let score = 0;
let acceptingAnswers = false;
const startingTime = 30;
let time = startingTime;
let timerInterval;
function startTimerForQuestion() {
    time = startingTime;
    timerElement.innerText = time;
    timerInterval = setInterval(updateTimer, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
}
function updateTimer() {
    if (time <= 10) {
        timerElement.style.color = 'red';
        if (!document.getElementById('audio').paused) {
            document.getElementById('audio').currentTime = 0;
        } else {
            document.getElementById('audio').play();
        }
        if (!document.getElementById('audio1').paused) {
            document.getElementById('audio1').pause();
        }
    } else {
        timerElement.style.color = '';
        if (!document.getElementById('audio1').paused) {
            document.getElementById('audio1').currentTime = 0; 
        } else {
            document.getElementById('audio1').play();
        }
        if (!document.getElementById('audio').paused) {
            document.getElementById('audio').pause();
        }
    }
    time--;
    timerElement.innerText = time;

    if (time <= 0) {
        clearInterval(timerInterval);
        localStorage.setItem('mostRecentScore', score);
        window.location.href = 'end.html';
    }
}

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    choices.forEach((choice, index) => {
        choice.innerText = currentQuestion['choice' + (index + 1)];
        choice.dataset.answer = index + 1;
        choice.classList.remove('correct', 'incorrect', 'selected');
        const input = choice.previousElementSibling;
        if (input) {
            input.checked = false;
        }
    });

    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    progressBarFull.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    acceptingAnswers = true;
    startTimerForQuestion();
}
function checkAnswer(selectedChoice) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;

    const selectedAnswer = parseInt(selectedChoice.dataset.answer);
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.answer) {
        selectedChoice.classList.add('correct');
        score += 10;
        scoreText.innerText = score;
    } else {
        const correctChoice = document.querySelector(`.choice[data-answer="${currentQuestion.answer}"]`);
        correctChoice.classList.add('correct');
        selectedChoice.classList.add('incorrect');
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 1000);
    } else {
        localStorage.setItem('mostRecentScore', score);
        window.location.href = 'end.html';
    }

    stopTimer(); 
}
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        if (!acceptingAnswers) return;
        if (!choice.classList.contains('correct') && !choice.classList.contains('incorrect')) {
            checkAnswer(choice);
        }
    });
});
startGame();
