const startLearningButton = document.getElementById('start-learning-btn');
const homePage = document.getElementById('home-page');
const quizPage = document.getElementById('quiz-page');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const menuIcon = document.getElementById('menu-icon');
const mobileMenu = document.getElementById('mobile-menu');


document.addEventListener('DOMContentLoaded', function () {
    const chapterWiseCard = document.getElementById('chapter-wise');
    const chapterPopup = document.getElementById('chapter-popup');
    const chapterList = document.getElementById('chapter-list');
    const startMcqButton = document.getElementById('start-mcq');
    const closePopupButton = document.getElementById('close-popup');
    const popupContent = chapterPopup.querySelector('div');

    // Sample chapters and questions (replace with your actual data)
    const chapters = [
        {
            name: "Chapter 1: Introduction",
            questions: [
                {
                    question: "What is X?",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: 0
                },
                {
                    question: "Define Y?",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: 1
                }
            ]
        },
        {
            name: "Chapter 2: Basics",
            questions: [
                {
                    question: "What is A?",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: 2
                },
                {
                    question: "Define B?",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: 3
                }
            ]
        }
    ];

    // Function to generate chapter list
    function generateChapterList() {
        chapterList.innerHTML = ''; // Clear existing list
        chapters.forEach(chapter => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'flex items-center mb-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
            chapterItem.innerHTML = `
                <input type="checkbox" id="${chapter.name}" class="mr-2">
                <label for="${chapter.name}" class="text-gray-800">${chapter.name}</label>
            `;
            chapterList.appendChild(chapterItem);
        });
    }

    // Show chapter popup on clicking Chapter Wise card
    chapterWiseCard.addEventListener('click', function () {
        generateChapterList();
        chapterPopup.classList.remove('hidden');
        setTimeout(() => {
            popupContent.classList.remove('scale-95', 'opacity-0');
            popupContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    });

    // Start MCQ button functionality
    startMcqButton.addEventListener('click', function () {
        const selectedChapters = [];
        document.querySelectorAll('#chapter-list input[type="checkbox"]:checked').forEach(checkbox => {
            selectedChapters.push(checkbox.id);
        });

        if (selectedChapters.length > 0) {
            // Fetch questions from selected chapters
            const selectedQuestions = [];
            selectedChapters.forEach(chapterName => {
                const chapter = chapters.find(ch => ch.name === chapterName);
                if (chapter) {
                    selectedQuestions.push(...chapter.questions);
                }
            });

            // Mix (shuffle) the questions
            const mixedQuestions = shuffleArray(selectedQuestions);

            // Store the mixed questions in localStorage
            localStorage.setItem('mixedQuestions', JSON.stringify(mixedQuestions));

            // Redirect to chapter-mcq.html
            window.location.href = 'chapter-mcq.html';
        } else {
            alert('Please select at least one chapter.');
        }
    });

    // Close popup when clicking outside or on the close button
    closePopupButton.addEventListener('click', function () {
        popupContent.classList.remove('scale-100', 'opacity-100');
        popupContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chapterPopup.classList.add('hidden');
        }, 300);
    });

    chapterPopup.addEventListener('click', function (event) {
        if (event.target === chapterPopup) {
            popupContent.classList.remove('scale-100', 'opacity-100');
            popupContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                chapterPopup.classList.add('hidden');
            }, 300);
        }
    });

    // Utility function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});

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


// Toggle Mobile Menu
const dropdownMenu = document.getElementById('dropdown-menu');

menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('open');
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


// Initialize the app when the page loads
initializeApp();