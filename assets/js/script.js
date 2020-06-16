
var viewTopScoresButton = document.querySelector('#topScores');
var timeRemainingField = document.querySelector('#count');
var currentScoreField = document.querySelector('#currentScore');
var highScoresContainer = document.querySelector('.high-scores-list');
var questionAnswerContainer = document.querySelector('.questions-answers');
var messageContainer = document.querySelector('.message-container');
var closeScoresButton = document.querySelector('.close-scores');
var startQuizButton = document.querySelector('#startQuiz');
var question = document.querySelector('.question');
var highScores = document.querySelector('#highScores');

var questionsAndAnswers = [
    {
        question: "What animal is extinct?",
        answer1: 'Camen',
        answer2: 'Dodo',
        answer3: 'Puma',
        answer4: 'Giant squid',
        correctAnswer: '2'
    },
    {
        question: "What was the color of royalty in teh Elizabethan era?",
        answer1: 'Gold',
        answer2: 'Purple',
        answer3: 'Yellow',
        answer4: 'Red',
        correctAnswer: '2'
    },
    {
        question: "Which fruit is not a berry?",
        answer1: 'Watermelon',
        answer2: 'Banana',
        answer3: 'Strawberry',
        answer4: 'Bramble',
        correctAnswer: '3'
    }
];

var numOfQuestions = questionsAndAnswers.length;

// Index of first question
var questionIndex = 0;

// Number of seconds given to complete the quiz
var timeRemaining = 120;

// Number of seconds deducted from timer when an incorrect answer is received
var wrongAnswerPenalty = 10;

// Number of points to grant for every correct answer
var correctAnswerPoints = 20;

// Everyone starts with 0 points
var score = 0;

// Holds the ID of the setInterval() call
var sid;

// This function retrieves the scores from local storagenand displays them on the page
function showTopScores() {
    // retrieve list of stores from local storage
    var currentScores = localStorage.getItem('highscores');
    var tr, td, quizTaker;

    if (!currentScores) {
        currentScores = [];
    } else {
        currentScores = JSON.parse(currentScores);
    }

    highScores.innerHTML = '';

    // list of scores in highScoresContainer
    for (var i = 0; i < currentScores.length; i++) {
        quizTaker = currentScores[i];

        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerHTML = quizTaker.name;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = quizTaker.score;
        tr.appendChild(td);

        highScores.appendChild(tr);
    }

    messageContainer.classList.add('hidden');
    startQuizButton.classList.add('hidden');
    highScoresContainer.classList.remove('hidden');
}

// close high Scores table
function closeTopScores() {
    highScoresContainer.classList.add('hidden');

    if (timeRemaining < 120) {
        if (questionAnswerContainer.classList.contains('hidden')) {
            questionAnswerContainer.classList.remove('hidden');
        }
    } else {
        if (messageContainer.classList.contains('hidden')) {
            messageContainer.classList.remove('hidden');
        }
        startQuizButton.classList.remove('hidden');
    }
}

// save score to local storage
function saveScore(name) {
    var userName;
    var currentScores = localStorage.getItem('highscores');

    // check if there are current scores
    if (!currentScores) {
        currentScores = [];
    } else {
        currentScores = JSON.parse(currentScores);
    }

    // prompt for user name
    userName = window.prompt('What is your name?');

    currentScores.push({
        name: userName,
        score: score
    });

    // save user's name and score to local store
    localStorage.setItem('highscores', JSON.stringify(currentScores));

    // display message that score has been saved
    console.log('Score has been saved for ', userName);
}

// checks if the answer is right or wrong
function checkAnswer() {
    console.log('Checking answer...');
    if (this.classList.contains('correct-answer')) {
        score = score + correctAnswerPoints;
        currentScoreField.innerHTML = score;
        console.log('Answer is correct!');

        // show next question
        showQuestion();
    } else {
        console.log('Answer is wrong!');
        // time remaining > penalty time
        if (timeRemaining > wrongAnswerPenalty) {
            timeRemaining = timeRemaining - wrongAnswerPenalty;

            // next question
            showQuestion();
        } else {
            timeRemaining = 0;
            // stop timer
            clearInterval(sid);
            // stop quiz
            stopQuiz();
        }
    }
}

// shows question and multiple-choice answers
function showQuestion() {
    var answers = document.querySelectorAll('.answer-button');
    var questionAnswerObj;
    var answerButton;
    var id;

    // check questionIndex is less than numOfQuestions
    // If true, grab a question from questionsAndAnswers array using questionIndex
    if (questionIndex < numOfQuestions) {
        questionAnswerObj = questionsAndAnswers[questionIndex];

        // display questions and answers
        question.innerHTML = questionAnswerObj.question;

        for (var i = 0; i < answers.length; i++) {
            id = i + 1;
            answerButton = answers[i];
            answerButton.innerHTML = questionAnswerObj['answer' + id];
            answerButton.dataset.answer = id;

            if (id === parseInt(questionAnswerObj.correctAnswer)) {
                answerButton.classList.add('correct-answer');
            }

            answerButton.addEventListener('click', checkAnswer);
        }

        if (questionAnswerContainer.classList.contains('hidden')) {
            questionAnswerContainer.classList.remove('hidden');
        }
    } else {
        stopQuiz();
    }

    questionIndex++;
}

// stop current quiz in progress
function stopQuiz() {
    var userName;

    // stop the countdown if timeRemaining === 0
    clearInterval(sid);

    // prompt if user wants to save score to local storage
    if (window.confirm('Save your score?')) {
        // save score
        saveScore();
    }

    // unhide Start button
    if (startQuizButton.classList.contains('hidden')) {
        startQuizButton.classList.remove('hidden');
    }

    questionAnswerContainer.classList.add('hidden');

    if (messageContainer.classList.contains('hidden')) {
        messageContainer.classList.remove('hidden');
    }
}

// starts the quiz
function startQuiz() {
    highScoresContainer.classList.add('hidden');
    messageContainer.classList.add('hidden');
    startQuizButton.classList.add('hidden');

    // reset timer
    timeRemaining = 120;

    // reset question index
    questionIndex = 0;

    // reset current score
    score = 0;
    currentScoreField.innerHTML = score;

    // start the countdown by decrementing timeRemaining by 1 every second (1000 ms)
    sid = setInterval(function () {
        timeRemainingField.innerHTML = --timeRemaining;
    }, 1000);

    highScoresContainer.classList.add('hidden');

    // show questions
    showQuestion();
}

// Add event listener to top scores button, call the event handler function
viewTopScoresButton.addEventListener('click', showTopScores);

closeScoresButton.addEventListener('click', closeTopScores);

// add event listener to start button and call event handler function
startQuizButton.addEventListener('click', startQuiz);