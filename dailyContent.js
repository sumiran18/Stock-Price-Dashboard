// Data for all sections
const financeQuestions = [
    { question: "What is the impact of inflation on savings?", options: ["Increases value", "Reduces value", "No impact", "Depends on the interest rate"], answer: 1 },
    { question: "Which type of investment is typically safer?", options: ["Stocks", "Bonds", "Real Estate", "Cryptocurrency"], answer: 1 }
];

const financeWords = [
    { word: "Bear Market", definition: "A prolonged period of falling stock prices, usually by 20% or more." },
    { word: "Bull Market", definition: "A market in which share prices are rising, encouraging buying." }
];

const financeTips = [
    { tip: "Diversify your portfolio to manage risk.", info: "Invest in various asset classes like stocks, bonds, and real estate." },
    { tip: "Start investing early to maximize returns.", info: "The power of compounding benefits long-term investments." }
];

const financeFacts = [
    { fact: "The stock market averages a 10% annual return.", info: "This demonstrates the power of compounding." },
    { fact: "Index funds often outperform actively managed funds.", info: "Lower fees and market performance drive this trend." }
];

// Function to set Question of the Day
function setQuestionOfTheDay() {
    const questionElement = document.querySelector("#question-content");
    const optionsElement = document.querySelector("#question-options");
    const questionData = financeQuestions[Math.floor(Math.random() * financeQuestions.length)];

    questionElement.innerHTML = `<strong>${questionData.question}</strong>`;
    optionsElement.innerHTML = questionData.options
        .map((opt, i) => `<button class="option" onclick="checkAnswer(${i}, ${questionData.answer})">${opt}</button>`)
        .join("<br>");
    localStorage.setItem("questionOfTheDay", JSON.stringify(questionData));
    localStorage.setItem("questionTimestamp", Date.now());
}

function checkAnswer(selected, correct) {
    const feedbackMessage = document.querySelector('#question-options ~ #feedback-message');
    const feedbackTitle = document.querySelector('#feedback-title');
    const feedbackPoints = document.querySelector('#feedback-points');
    const coin = document.querySelector('#coin');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    if (selected === correct) {
        correctSound.play();

        feedbackTitle.innerText = "Correct!";
        

        coin.classList.remove('hidden');
        coin.classList.add('visible', 'coin-animation');

        setTimeout(() => {
            coin.classList.remove('visible', 'coin-animation');
            coin.classList.add('hidden');
        }, 1000);

        feedbackMessage.classList.remove('hidden', 'slide-out');
        feedbackMessage.classList.add('visible');

        setTimeout(() => {
            feedbackMessage.classList.remove('visible');
            feedbackMessage.classList.add('slide-out');
            setTimeout(() => feedbackMessage.classList.add('hidden'), 500);
        }, 2000);

        updatePoints(5);
    } else {
        incorrectSound.play();

        feedbackTitle.innerText = "Incorrect!";
        
        feedbackMessage.classList.remove('hidden', 'slide-out');
        feedbackMessage.classList.add('visible');

        setTimeout(() => {
            feedbackMessage.classList.remove('visible');
            feedbackMessage.classList.add('slide-out');
            setTimeout(() => feedbackMessage.classList.add('hidden'), 500);
        }, 2000);
    }
}

// Function to set Word of the Day
function setWordOfTheDay() {
    const wordElement = document.querySelector("#word-content");
    const definitionElement = document.querySelector("#word-definition");
    const wordData = financeWords[Math.floor(Math.random() * financeWords.length)];

    wordElement.textContent = wordData.word;
    definitionElement.textContent = wordData.definition;

    localStorage.setItem("wordOfTheDay", JSON.stringify(wordData));
    localStorage.setItem("wordTimestamp", Date.now());
}

// Function to set Daily Investment Tip
function setTipOfTheDay() {
    const tipElement = document.getElementById("investment-tip");
    const infoElement = document.getElementById("investment-tip-info");
    const tipData = financeTips[Math.floor(Math.random() * financeTips.length)];

    tipElement.textContent = tipData.tip;
    infoElement.textContent = tipData.info;

    localStorage.setItem("tipOfTheDay", JSON.stringify(tipData));
    localStorage.setItem("tipTimestamp", Date.now());
}

// Function to set Fact of the Day
function setFactOfTheDay() {
    const factElement = document.getElementById("fact-content");
    const infoElement = document.getElementById("fact-info");
    const factData = financeFacts[Math.floor(Math.random() * financeFacts.length)];

    factElement.textContent = factData.fact;
    infoElement.textContent = factData.info;

    localStorage.setItem("factOfTheDay", JSON.stringify(factData));
    localStorage.setItem("factTimestamp", Date.now());
}


// Function to initialize all daily content
function initializeDailyContent() {
    const now = Date.now();

    // Initialize Question of the Day
    const questionTimestamp = parseInt(localStorage.getItem("questionTimestamp"));
    if (!questionTimestamp || now - questionTimestamp >= 86400000) {
        setQuestionOfTheDay();
    } else {
        const questionData = JSON.parse(localStorage.getItem("questionOfTheDay"));
        document.querySelector("#question-content").innerHTML = `<strong>${questionData.question}</strong>`;
        document.querySelector("#question-options").innerHTML = questionData.options
            .map((opt, i) => `<button onclick="checkAnswer(${i}, ${questionData.answer})">${opt}</button>`)
            .join("<br>");
    }

    // Initialize Word of the Day
    const wordTimestamp = parseInt(localStorage.getItem("wordTimestamp"));
    if (!wordTimestamp || now - wordTimestamp >= 86400000) {
        setWordOfTheDay();
    } else {
        const wordData = JSON.parse(localStorage.getItem("wordOfTheDay"));
        document.querySelector("#word-content").textContent = wordData.word;
        document.querySelector("#word-definition").textContent = wordData.definition;
    }

    // Initialize Daily Investment Tip
    const tipTimestamp = parseInt(localStorage.getItem("tipTimestamp"));
    if (!tipTimestamp || now - tipTimestamp >= 86400000) {
        setTipOfTheDay();
    } else {
        const tipData = JSON.parse(localStorage.getItem("tipOfTheDay"));
        document.getElementById("investment-tip").textContent = tipData.tip;
        document.getElementById("investment-tip-info").textContent = tipData.info;
    }

    // Initialize Fact of the Day
    const factTimestamp = parseInt(localStorage.getItem("factTimestamp"));
    if (!factTimestamp || now - factTimestamp >= 86400000) {
        setFactOfTheDay();
    } else {
        const factData = JSON.parse(localStorage.getItem("factOfTheDay"));
        document.getElementById("fact-content").textContent = factData.fact;
        document.getElementById("fact-info").textContent = factData.info;
    }

    initializePoints();
}

// Call initialize on page load
document.addEventListener("DOMContentLoaded", initializeDailyContent);
