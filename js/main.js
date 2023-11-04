import getRandomLine from "./poetry.js"

let timeTaken = 0
let timer
const userAnswer = document.getElementById('user-answer')
const testText = document.getElementById('test-text')
const highlight = document.getElementById('highlight')

let totalCorrectAnswers = []
let totalUserAnswers = []
let wordCorrectness = []

let correctAnswers = 0
let incorrectAnswers = 0

/**Starts a 60 sec countdown and updates the innerHTMl every 1 sec.*/
function startTimer() {
    timer = setInterval(() => {
        if (timeTaken >= 61) {
            clearInterval(timer)
        } else {
            document.getElementById('timer').innerHTML = 60 - timeTaken
            timeTaken += 1
        }        
    }, 1000)        
}

/**Initializes an await for random line to load and checks if line valid*/
async function initLine() {
    let result = await getRandomLine()
    while (result === undefined || result === '') {
        result = await getRandomLine()
    }
    testText.innerHTML = result    
}

function colorReact() { 
    const userText = userAnswer.value
    const testTextContent = testText.textContent   
    const testTextArray = testTextContent.split(' ')
    let coloredText = ''
    let correct = true

    for (let i = 0; i < Math.min(userText.length, testTextContent.length); i++) {
        if (userText.charAt(i) === testTextContent.charAt(i)) {
            coloredText += '<span style="background-color: #66FF99;">' + testTextContent.charAt(i) + '</span>'
        } else {
            coloredText += '<span style="background-color: #FFCCCB;">' + testTextContent.charAt(i) + '</span>'    
            correct = false
        }           
    }
    if (testTextContent.length > userText.length) {
        coloredText += testTextContent.substring(userText.length)
    } 
    testText.innerHTML = coloredText
    
    for (let i = 0; i < testTextArray.length; i++) {
        if (i < userText.length && userText.charAt(i) === testTextArray[i]) {
            wordCorrectness[i] = true;
        } else {
            wordCorrectness[i] = false;
        }
        }    
    
}

function currentWord() {
    const userText = userAnswer.value
    const testTextContent = testText.textContent
    const testTextArray = testTextContent.split(' ')
    let totalLengthBase = 0
    let currentWordIndex = 0  
    
    for (let i = 0; i < userText.length; i++) {
        let adjustedWordPos = testTextArray[currentWordIndex].length + totalLengthBase
      if (i < adjustedWordPos) {
        highlight.innerHTML = testTextArray[currentWordIndex]        
      } else {        
        totalLengthBase += testTextArray[currentWordIndex].length + 1
        currentWordIndex++
      }      
    }    
}
function computeStats() {
    for (let i = 0; i < wordCorrectness.length; i++) {
        if (wordCorrectness[i]) {
            correctAnswers++
        } else {
            incorrectAnswers++
        }
    }

    wordCorrectness = []
}


userAnswer.addEventListener('input', () => {
    if (!timer) {
        startTimer()
    }
    currentWord()    
    colorReact()
    if (userAnswer.value.length === testText.textContent.length) {
        computeStats()
        document.getElementById('stats').innerHTML = `+${correctAnswers}, -${incorrectAnswers}`
        userAnswer.value = ''
        initLine()
    }
    
})

initLine()




