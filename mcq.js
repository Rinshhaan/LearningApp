const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const nextButton = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const correctAnswerFeedback = document.getElementById('correct-answer-feedback');

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
    },
    {
        question: 'What is the square root of 64?',
        answers: [
            { text: '8', correct: true },
            { text: '6', correct: false },
            { text: '10', correct: false },
            { text: '12', correct: false }
        ]
    },
    {
        question: 'Who wrote "Romeo and Juliet"?',
        answers: [
            { text: 'William Shakespeare', correct: true },
            { text: 'Charles Dickens', correct: false },
            { text: 'Mark Twain', correct: false },
            { text: 'Jane Austen', correct: false }
        ]
    }
];

// Initialize the quiz
function startQuiz() {
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
    updateProgressBar();
}

// Display the question and answers
function showQuestion(question) {
    questionElement.innerText = question.question;
    const shuffledAnswers = question.answers.sort(() => Math.random() - 0.5); // Randomize answer positions
    shuffledAnswers.forEach(answer => {
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
    correctAnswerFeedback.classList.add('hide'); // Hide correct answer feedback
    correctAnswerFeedback.innerText = ''; // Clear the feedback text
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
        gsap.to(selectedButton, { 
            backgroundColor: '#10B981', // Green color
            scale: 1.2, 
            duration: 0.3, 
            yoyo: true, 
            repeat: 1 
        });
    } else {
        gsap.to(selectedButton, { 
            backgroundColor: '#EF4444', // Red color
            scale: 1.2, 
            duration: 0.3, 
            yoyo: true, 
            repeat: 1 
        });
        // Show correct answer feedback
        const correctAnswer = shuffledQuestions[currentQuestionIndex].answers.find(answer => answer.correct);
        correctAnswerFeedback.innerText = `Correct Answer: ${correctAnswer.text}`;
        correctAnswerFeedback.classList.remove('hide');
        gsap.from(correctAnswerFeedback, { y: 50, opacity: 0, duration: 0.5 });
    }
    // Disable all buttons after selection
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });
    nextButton.classList.remove('hide');
}

// Move to the next question
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (shuffledQuestions.length > currentQuestionIndex) {
        setNextQuestion();
    } else {
        showFinalProgress();
    }
});

// Show final progress with a circular progress bar and confetti
function showFinalProgress() {
    const percentage = Math.round((score / questions.length) * 100);
    Swal.fire({
        title: 'Quiz Completed!',
        html: `
            <div class="flex flex-col items-center space-y-4">
                <!-- Circular Progress Bar -->
                <div class="w-32 h-32 relative">
                    <svg class="w-full h-full" viewBox="0 0 36 36">
                        <path class="text-gray-200 stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="2" />
                        <path class="text-pink-500 stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="2" stroke-dasharray="${percentage}, 100" />
                        <text x="18" y="20.35" class="text-lg font-bold fill-current text-white" text-anchor="middle" dy=".3em">${percentage}%</text>
                    </svg>
                </div>

                <!-- Score Details -->
                <div class="text-center">
                    <p class="text-xl font-bold">You scored <span class="text-pink-500">${score}</span> out of <span class="text-purple-500">${questions.length}</span>.</p>
                    <p class="text-sm text-gray-300">Keep up the great work!</p>
                </div>

                <!-- Go to Home Button -->
                <a href="index.html" class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-transform">Go to Home</a>

                <!-- Animated Confetti -->
                <div id="confetti" class="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'Close',
        customClass: {
            popup: 'bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-lg shadow-lg',
            confirmButton: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform'
        },
        didOpen: () => {
            // Add confetti animation
            const confettiContainer = document.getElementById('confetti');
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confettiContainer.appendChild(confetti);
            }
        }
    });
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Clear status classes
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Start the quiz when the page loads
startQuiz();