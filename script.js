const startLearningButton = document.getElementById('start-learning-btn');
const homePage = document.getElementById('home-page');
const quizPage = document.getElementById('quiz-page');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const cartoonKid = document.getElementById('cartoon-kid');
const kidMessage = document.getElementById('kid-message');
const menuIcon = document.getElementById('menu-icon');
const mobileMenu = document.getElementById('mobile-menu');

let shuffledQuestions, currentQuestionIndex, score;

const questions = [
    {
        question: 'What is 2 + 2?',
        answers: [
            { text: '4', correct: true },
            { text: '22', correct: false },
            { text: '5', correct: false },
            { text: '6', correct: false }
        ]
    },
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'Paris', correct: true },
            { text: 'London', correct: false },
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false }
        ]
    },
    {
        question: 'What is the largest planet in our solar system?',
        answers: [
            { text: 'Earth', correct: false },
            { text: 'Jupiter', correct: true },
            { text: 'Saturn', correct: false },
            { text: 'Mars', correct: false }
        ]
    }
];

const motivationalMessages = [
    "You're doing great! Keep it up!",
    "Believe in yourself!",
    "Every question is a step closer to success!",
    "You've got this!",
    "Stay focused and keep learning!"
];

// Toggle Dropdown Menu
const dropdownMenu = document.getElementById('dropdown-menu');

menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('open');
});

// Toggle Mobile Dropdown

menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('max-h-0');
    dropdownMenu.classList.toggle('max-h-96');
});

// Toggle Courses Dropdown on Click
const coursesLink = document.getElementById('courses-link');
const coursesDropdown = document.getElementById('courses-dropdown');
const mobileCoursesLink = document.getElementById('mobile-courses-link');
const mobileCoursesDropdown = document.getElementById('mobile-courses-dropdown');

coursesLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    coursesDropdown.classList.toggle('max-h-0');
    coursesDropdown.classList.toggle('max-h-96');
});

mobileCoursesLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    mobileCoursesDropdown.classList.toggle('max-h-0');
    mobileCoursesDropdown.classList.toggle('max-h-96');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!coursesLink.contains(e.target) && !coursesDropdown.contains(e.target)) {
        coursesDropdown.classList.add('max-h-0');
        coursesDropdown.classList.remove('max-h-96');
    }
    if (!mobileCoursesLink.contains(e.target) && !mobileCoursesDropdown.contains(e.target)) {
        mobileCoursesDropdown.classList.add('max-h-0');
        mobileCoursesDropdown.classList.remove('max-h-96');
    }
});

// Initialize the app
function initializeApp() {
    // Show the cartoon kid on the home page
    showCartoonKid();
    // Show a random motivational message every 10 seconds
    setInterval(showRandomMessage, 10000);
}


// Start the quiz
startLearningButton.addEventListener('click', startQuiz);

// Move to the next question
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

// Toggle mobile menu
menuIcon.addEventListener('click', () => {
    mobileMenu.classList.toggle('hide');
});

// Start the quiz
function startQuiz() {
    homePage.classList.add('hide');
    quizPage.classList.remove('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

// Set the next question
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Display the question and answers
function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('bg-white', 'bg-opacity-10', 'text-white', 'p-4', 'rounded-lg', 'hover:bg-opacity-20', 'transition-colors');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// Reset the state for the next question
function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// Handle answer selection
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
        scoreElement.innerText = score;
        gsap.to(selectedButton, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
    } else {
        gsap.to(selectedButton, { x: [-10, 10, -10, 10, 0], duration: 0.5 });
        // Highlight the correct answer
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                gsap.to(button, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
            }
        });
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        showTrackingPopup();
    }
}



// Show the tracking popup
function showTrackingPopup() {
    const percentage = Math.round((score / questions.length) * 100);
    alert(`Quiz Completed! You scored ${score} out of ${questions.length}. Your score is ${percentage}%.`);
}

// Show the cartoon kid
function showCartoonKid() {
    cartoonKid.classList.remove('hide');
    kidMessage.classList.remove('hide');
    gsap.from(cartoonKid, { y: 100, opacity: 0, duration: 1, ease: 'bounce.out' });
    gsap.from(kidMessage, { y: 50, opacity: 0, duration: 1, delay: 1 });
}

// Show a random motivational message
function showRandomMessage() {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    kidMessage.innerText = randomMessage;
    gsap.to(kidMessage, { opacity: 1, duration: 0.5, yoyo: true, repeat: 1 });
}

// Initialize the app when the page loads
initializeApp();